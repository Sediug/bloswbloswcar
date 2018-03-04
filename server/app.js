const app = require('pillars');
const mongoose = require('mongoose');
const opn = require('opn');

// Load .env config.
console.info('Loading dotenv.');
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
app.config.debug = process.env.DEBUG_MODE;
// app.config.favicon = "favico.ico";

console.info('Connecting to database.');
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true }, err => {
	if (err) {
		throw new Error(`Database connection error: ${err}`);
	}

	console.info('Successfully connected to database server. Starting server...');

	app.services.get('http').configure({
		host: process.env.HOST,
		port: process.env.PORT
	}).start();

	const uri = `http://${ process.env.HOST }:${ process.env.PORT }`;
	console.info(`Server running on ${ uri }`);

	if (process.env.DEBUG_MODE) {
		console.info('Opening web browser...');
		opn(uri);
	}
});

