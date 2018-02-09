const dbManager = require('../lib/announcementsDBManager');

function validateId(gw, id) {
	if (!id.match(/^[0-9a-fA-F]{24}$/)) {
		gw.error(404, Error('El id enviado no es válido.'));
	}
}

function get(gw) {
	if (gw.pathParams.id) {
		validateId(gw, gw.pathParams.id);
		dbManager.get(gw.pathParams.id, (err, announcement) => {
			if (err) {
				return gw.error(404,  Error(`El anuncio no existe`));
			}

			gw.json(announcement);
		});
	} else {
		dbManager.get(null, (err, announcements) => {
			gw.json(announcements);
		});
	}
}

function create(gw) {
	const data = Object.assign({}, gw.content.params);
	dbManager.create(data, (err, storedAnnouncement) => {
		if (err) {
			return gw.error(500, Error(`Error al crear en la base de datos: ${err}`));
		}

		gw.json(storedAnnouncement, {deep: 0});
	});
}

function update(gw) {
	validateId(gw, gw.pathParams.id);
	const id = gw.pathParams.id;
	const data = Object.assign({}, gw.content.params);

	dbManager.update(id, data, (err, updatedAnnouncement) => {
		if (err) {
			gw.error(500, Error(`Error al actualizar en la base de datos: ${err}`));
		}

		gw.json(updatedAnnouncement, {deep: 0});
	});
}

function deleteAnnouncement(gw) {
	validateId(gw, gw.pathParams.id);
	const id = gw.pathParams.id;

	dbManager.delete(id, (err, announcement) => {
		if (err) {
			gw.error(500, Error(`Error al eliminar el anuncio: ${err}`));
		}

		gw.json({ message: 'El anuncio ha sido eliminado con exito.' });
	});
}

module.exports = { get, create, update, delete: deleteAnnouncement };
