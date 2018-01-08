/* global Route */
const app = require('pillars'); // singleton
const io = require('socket.io')(app.services.get('http').server, {serveClient: false});
const AnnouncementModel = require('../model/Announcement');
const dbManager = require('../lib/dbManager');

module.exports = function() {
	const model = new AnnouncementModel();

	// Listen input channels
	io.on('connection', socket => {
		socket.emit('announcements', model.getAll());

		socket.on('add', data => {
			if (validate(data)) {
				data.id = null;
				model.save(data);
			} else {
				console.error('Invalid payload data received on announcement add', data);
			}
		});

		socket.on('update', data => {
			if (validate(data)) {
				model.save(data);
			} else {
				console.error('Invalid payload data received on announcement update', data);
			}
		});
	});

	// Update clients on change data
	dbManager().on('change', () => {
		io.sockets.emit('announcements', model.getAll());
	});

	// Private functions
	function validate(data) {
		return data !== null && typeof(data) === 'object' && !Array.isArray(data);
	}
};