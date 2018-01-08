/* global Route */
const app = require('pillars');
const Announcement = require('./controller/Announcement');
const User = require('./controller/User');

// Configure pillars project
app.config.debug = true;
// app.config.favicon = "img/favico.ico";

// Starting the app
console.info('Starting the app...');
app.services.get('http').configure({
	host: 'localhost',
	port: process.env.PORT || 8080
}).start();

// Static Files and main route
const mainRoute = new Route({
	id: 'main',
	path: '/',
	method: 'GET',
	session: true
}, gw => {
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
}, gw => {
	gw.file('./node_modules/socket.io-client/dist/socket.io.js');
});

ioClientRoute.routes.add(new Route({
	id: 'ioClientMap',
	path: '/socket.io.js.map',
}, gw => {
	gw.file('./node_modules/socket.io-client/dist/socket.io.js.map');
}));

// Add controller routes.

// Socket.io listening for announcements
new Announcement();

// Add routes to the server
console.info('Adding routes...')
app.routes.add(ioClientRoute);
app.routes.add(mainRoute);
app.routes.add(estatics);

console.info('Server running...')