/* global Route */
const app = require('pillars');

// Configure pillars project
app.config.debug = true;
// app.config.favicon = "img/favico.ico";

// Starting the app
console.info('Starting the app...');
app.services.get('http').configure({
	host: 'localhost',
	port: process.env.PORT || 8080
}).start();

// Create DB instance.
const goblinDB = require("@goblindb/goblindb")();

// Static Files and main route
const mainRoute = new Route({
	id: 'main',
	path: '/',
	method: 'GET',
	session: true
}, function(gw) {
	gw.file('./public/index.html');
});

const estatics = new Route({
	id: 'estatics',
	path: '/*:path',
	directory: {
		path: './public',
		listing: true
	}
});

// Serve socket.io client on Pillars.
const ioClientRoute = new Route({
	id: 'ioClient',
	path: '/socket.io.js',
}, function(gw) {
	gw.file('./node_modules/socket.io-client/dist/socket.io.js');
});

ioClientRoute.routes.add(new Route({
	id: 'ioClientMap',
	path: '/socket.io.js.map',
}, function(gw) {
	gw.file('./node_modules/socket.io-client/dist/socket.io.js.map');
}));

// Add controllers routes.
const Announcement = require('./controller/Announcement');

console.info('Adding routes...')
mainRoute.routes.add(new Announcement(goblinDB)); // Socket.io listening on /announcement

// Add routes to the server
app.routes.add(ioClientRoute);
app.routes.add(mainRoute);
app.routes.add(estatics);

console.info('Server running...')