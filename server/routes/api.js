/* global Route */
const announcements = require('../controller/announcements');
const users = require('../controller/users');

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
api.routes.add(new Route(
	{
		id: 'getUsers',
		path:'/users',
		method:['get']
	},
	gw => users.get(gw)
));

api.routes.add(new Route(
	{
		id: 'getUser',
		path:'/users/:id',
		method:['get']
	},
	gw => users.get(gw)
));

// Announcements
api.routes.add(new Route(
	{
		id: 'getAnnouncements',
		path:'/announcements',
		method:['get']
	},
	gw => announcements.get(gw)
));

api.routes.add(new Route(
	{
		id: 'getAnnouncement',
		path:'/announcements/:id',
		method:['get']
	},
	gw => announcements.get(gw)
));

api.routes.add(new Route(
	{
		id: 'postAnnouncement',
		path:'/announcements/:id',
		method:['post']
	},
	gw => announcements.create(gw)
));

api.routes.add(new Route(
	{
		id: 'getAnnouncement',
		path:'/announcements/:id',
		method:['put']
	},
	gw => announcements.update(gw)
));

api.routes.add(new Route(
	{
		id: 'getAnnouncement',
		path:'/announcements/:id',
		method:['delete']
	},
	gw => announcements.delete(gw)
));

module.exports =  api;
