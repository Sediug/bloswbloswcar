const app = require('pillars');
const mongoose = require('mongoose');
require('dotenv').config();
require('./routes');
require('./passport');

// Controllers
const Announcement = require('./controller/announcement');
const Oauth = require('./controller/oauth');

// Configure pillars project and connect to mongoDB
app.config.debug = true;
app.config.favicon = "img/favico.ico";

mongoose.connect(process.env.MONGODB_URI, (err, res) => {
	if (err) {
		return console.error(`Database connection error: ${err}`)
	}
	console.info('Successfully connected to database server.');
	console.info('Starting app...');

	app.services.get('http').configure({
		host: process.env.HOST,
		port: process.env.PORT
	}).start();

	// Socket.io listening for announcements
	new Announcement();

	console.info('Server running...');
});

