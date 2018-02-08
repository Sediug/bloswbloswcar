const server = require('pillars').services.get('http').server;
const io = require('socket.io')(server, {serveClient: false});
const db = require('../lib/announcementsDBManager');

module.exports = function() {
	db.init(error => {
		if (error) {
			throw Error(error);
		}

		console.info(`Announcements socket listening on port ${ process.env.PORT }`);
		// Listen input channels
		io.on('connection', socket => {
			socket.emit('announcements', db.get());

			socket.on('add', data => {
				if (validate(data)) {
					db.add(data, err => {
						socket.emit('announcementError', `Error añadiendo anuncio: ${err}`);
					});
				} else {
					socket.emit(
						'announcementError',
						`Los datos recibidos para crear un viaje no son validos: ${String(data)}`
					);
				}
			});

			socket.on('update', data => {
				if (validate(data)) {
					db.update(data._id, data, err => {
						socket.emit('announcementError', `Error actualizando anuncio: ${err}`);
					});
				} else {
					socket.emit(
						'announcementError',
						`Los datos recibidos para actualizar un viaje no son validos: ${String(data)}`
					);
				}
			});

			socket.on('delete', id => {
				if (id !== undefined) {
					db.delete(id, err => {
						socket.emit('announcementError', `Error borrando anuncio: ${err}`);
					});
				} else {
					socket.emit(
						'announcementError',
						`Falta el id del anuncio que quieres borrar`
					);
				}
			});
		});

		// Update clients on change data
		db.goblin.on('change', () => {
			// Timeout because of a bug in goblin. It has to be removed.
			setTimeout(() => io.sockets.emit('announcements', db.get()), 100);
		});
	});

	// Private functions
	function validate(data) {
		return data !== null && typeof(data) === 'object' && !Array.isArray(data);
	}
}();
