/* global Route */
const app = require('pillars'); // singleton
const io = require('socket.io')(app.services.get('http').server, {serveClient: false});
const db = require('../lib/announcementsDBManager');

module.exports = function() {
	db.init(() => {
		console.info(`Announcements socket listening on port ${ process.env.PORT }`);
		// Listen input channels
		io.on('connection', socket => {
			socket.emit('announcements', db.get());

			socket.on('add', data => {
				if (validate(data)) {
					db.add(data);
				} else {
					console.error('Invalid payload data received on announcement add', data);
				}
			});

			socket.on('update', data => {
				if (validate(data)) {
					db.update(data._id, data);
				} else {
					console.error('Invalid payload data received on announcement update', data);
				}
			});

			socket.on('delete', id => {
				if (id !== undefined) {
					db.delete(id);
				} else {
					console.error('Missing announcement id to delete.');
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
