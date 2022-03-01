const server = require('pillars').services.get('http').server;
const io = require('socket.io')(server, {serveClient: false});
const db = require('../lib/announcementsDBManager');

/**
 * Initializing announcements db manager and set socket io listening for clients
 * connections. This file is a script, it doesn't exports anything.
 */
db.init(error => {
	if (error) {
		throw Error(error);
	}

	console.info(`Announcements socket listening on port ${ process.env.PORT }`);

	// Listen input channels
	io.on('connection', handler);

	// Update clients on change data
	db.goblin.on('change', () => {
		// Timeout because of a bug in goblin. It has to be removed.
		setTimeout(() => {
			db.get(null, (err, announcements) => {
				io.sockets.emit('announcements', announcements);
			});
		}, 100);
	});
});

/**
 * Handler for socket connection. Listen input channels in the current websocket.
 *
 * @param {object} socket Connected socket
 * @returns {void}
 */
function handler(socket) {
	db.get(null, (err, announcements) => {
		socket.emit('announcements', announcements);
	});

	socket.on('create', data => {
		if (!validate(data)) {
			return socket.emit(
				'announcementError',
				`Los datos recibidos para crear un anuncio no son validos: ${String(data)}`
			);
		}

		db.create(data, (err, result) => {
			err &&
			socket.emit('announcementError', `Error añadiendo anuncio: ${err}`);
		});
	});

	socket.on('update', data => {
		if (!validate(data)) {
			return socket.emit(
				'announcementError',
				`Los datos recibidos para actualizar un anuncio no son validos: ${String(data)}`
			);
		}

		db.update(data._id, data, err => {
			err &&
			socket.emit('announcementError', `Error actualizando anuncio: ${err}`);
		});
	});

	socket.on('delete', id => {
		if (id === undefined) {
			return socket.emit(
				'announcementError',
				`Falta el id del anuncio que quieres borrar`
			);
		}

		db.delete(id, err => {
			err &&
			socket.emit('announcementError', `Error borrando anuncio: ${err}`);
		});
	});
}

/**
 * Validates client payload data.
 *
 * @param {object} data Payload data.
 * @returns {bool} Valid.
 */
function validate(data) {
	return data !== null && typeof(data) === 'object' && !Array.isArray(data);
}
