/* global Route */
// Create api route.
const api = new Route(
	{
		id: 'api',
		path:'/api',
		method:['get'],
		session: true
	},
	gw => {
		// api info
		gw.json({
			description: 'API Rest v1',
			endPoints: {
				announcements: '/api/announcements/:id',
				users: '/api/users/:id'
			}
		}, {deep: 0});
	}
);

// Users
const users = require('../controller/users');
api.routes.add(new Route({ path:'/users', method:['get'] }, users.get));
api.routes.add(new Route({ path:'/users/:id', method:['get'] }, users.get));

// Announcements
const announcements = require('../controller/announcements');
api.routes.add(new Route({ path:'/announcements', method:['get'] }, announcements.get));
api.routes.add(new Route({ path:'/announcements/:id', method:['get'] }, announcements.get));
api.routes.add(new Route({ path:'/announcements/:id', method:['post'] }, announcements.create));
api.routes.add(new Route({ path:'/announcements/:id', method:['put'] }, announcements.update));
api.routes.add(new Route({ path:'/announcements/:id', method:['delete'] }, announcements.delete));

module.exports =  api;
