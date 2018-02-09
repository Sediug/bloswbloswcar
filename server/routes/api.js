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
			announcements: '/api/announcements/:id',
			users: '/api/users/:id'
		}, {deep: 0});
	}
);

// Users
const users = require('../controller/users');
api.routes.add(new Route({ path:'/users', method:['get'] }, users.get));
api.routes.add(new Route({ path:'/users/:id', method:['get'] }, users.get));

// Announcements
const an = require('../controller/announcements');
api.routes.add(new Route({ path:'/announcements', method:['get'] }, an.get));
api.routes.add(new Route({ path:'/announcements/:id', method:['get'] }, an.get));
api.routes.add(new Route({ path:'/announcements/:id', method:['post'] }, an.create));
api.routes.add(new Route({ path:'/announcements/:id', method:['put'] }, an.update));
api.routes.add(new Route({ path:'/announcements/:id', method:['delete'] }, an.delete));

module.exports =  api;
