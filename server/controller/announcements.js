const Announcement = require('../model/announcement');
const socketsDBManager = require('../lib/announcementsDBManager');

function updateSocketsDB(type, announcement) {
	try {
		socketsDBManager.updateGDB(type, announcement, error => {
			throw Error(error);
		});
	} catch(e) {
		console.error(`Error updating goblin db: ${e.message}`);
	}
}

function validateId(gw, id) {
	if (!id.match(/^[0-9a-fA-F]{24}$/)) {
		gw.error(404, Error('El id enviado no es válido.'));
	}
}

function get(gw) {
	if (gw.pathParams.id) {
		validateId(gw, gw.pathParams.id);
		Announcement.findById(String(gw.pathParams.id), (err, announcement) => {
			if (err) {
				return gw.error(500, Error(`Error al realizar la petición: ${err}`));
			}

			if (!announcement) {
				return gw.error(404, Error(`El anuncio no existe`));
			}

			gw.json(announcement);
		});
	} else {
		Announcement.find({}, (err, announcements) => {
			if (err) {
				return gw.error(500, Error(`Error al realizar la petición: ${err}`));
			}

			gw.json(announcements);
		});
	}
}

function create(gw) {
	const params = gw.content.params;
	const announcement = Object.assign(new Announcement(), params);
	announcement.user_id = null; // Have to be changed for the id user creating this ann.

	announcement.save((err, storedAnnouncement) => {
		if (err) {
			return gw.error(500, Error(`Error al crear en la base de datos: ${err}`));
		}

		updateSocketsDB('create', storedAnnouncement);
		gw.json(storedAnnouncement);
	})
}

function update(gw) {
	validateId(gw, gw.pathParams.id);
	const id = gw.pathParams.id;
	const announcement = Object.assign({}, gw.content.params, { updated_dtm: Date.now });

	if (announcement.created_dtm) {
		delete announcement.created_dtm;
	}

	Announcement.findByIdAndUpdate(id, announcement, (err, updatedAnnouncement) => {
		if (err) {
			gw.error(500, Error(`Error al actualizar el anuncio: ${err}`));
		}

		updateSocketsDB('update', updatedAnnouncement);
		gw.json(updatedAnnouncement);
	});
}

function deleteAnnouncement(gw) {
	validateId(gw, gw.pathParams.id);
	const id = gw.pathParams.id;

	function error(err) {
		gw.error(500, Error(`Error al borrar el anuncio: ${err}`));
	}

	Announcement.findById(id, (err, announcement) => {
		err && error(err);

		announcement.remove(err => {
			err && error(err);
			updateSocketsDB('delete', announcement);
			gw.json({ message: 'El anuncio ha sido eliminado con exito.' });
		});
	});
}

module.exports = { get, create, update, delete: deleteAnnouncement };
