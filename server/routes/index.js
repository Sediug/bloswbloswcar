/*global Route */
const routes = require('pillars').routes;
const auth = require('./auth');
const api = require('./api');

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
	path: '/assets/*:path',
	session: true,
	directory: {
		path: './public/assets',
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


// Add routes to the server
console.info('Adding routes to the server.');
routes.add(auth);
routes.add(api);
routes.add(ioClientRoute);
routes.add(mainRoute);
routes.add(estatics);
