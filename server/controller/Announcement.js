/* global Route */
const app = require('pillars'); // singleton
const io = require('socket.io')(app.services.get('http').server, {serveClient: false});
const AnnouncementModel = require('../model/Announcement');

module.exports = function(gdb) {
	const model = new AnnouncementModel(gdb);

	// Listen input channels
	io.on('connection', function(socket) {
		socket.emit('announcements', model.getAll());

		socket.on('add', function(data) {
			if (validate(data)) {
				data.id = null;
				model.save(data);
			} else {
				console.error('Invalid payload data received on announcement add', data);
			}
		});

		socket.on('update', function(data) {
			if (validate(data)) {
				model.save(data);
			} else {
				console.error('Invalid payload data received on announcement update', data);
			}
		});
	});

	// Send output data
	gdb.on('add', function(db) {
		console.log('add', db);
	});

	gdb.on('update', function(db) {
		console.log('update', db);
	});

	gdb.on('delete', function(db) {
		console.log('delete', db);
	});

	gdb.on('change', function(db) {
		console.log('change', db);
	});

	// Private functions
	function validate(data) {
		return data !== null && typeof(data) === 'object' && !Array.isArray(data);
	}
};