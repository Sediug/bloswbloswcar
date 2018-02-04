const app = require('pillars');
const mongoose = require('mongoose');

// Load .env config.
require('dotenv').config();

// Configure passport and add it to pillars project.
require('./passport');

// Load controllers
require('./controller/users');
require('./controller/announcements');

// Add default routes to the pillars project.
require('./routes');

// Configure pillars project and connect to mongoDB
app.config.debug = process.env.PILLARS_APP_DEBUG_MODE;
// app.config.favicon = "favico.ico";

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

	console.info(`Server running on http://${ process.env.HOST }:${ process.env.PORT }`);
});

