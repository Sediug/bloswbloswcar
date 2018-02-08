const app = require('pillars');
const mongoose = require('mongoose');

// Load .env config.
console.info('Loading .env.');
require('dotenv').config();

// Configure passport and add it to pillars project.
console.info('Configuring passport.');
require('./passport');

// Add routes to the pillars project.
console.info('Adding routes.');
require('./routes');

// Load and configure sockets
console.info('Adding announcements socket.');
require('./sockets/announcements');

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

