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
				announcements: {
					GET: [
						{
							url: '/api/announcements',
							description: 'Gets all announcements.'
						},
						{
							url: '/api/announcements/:id',
							description: 'Gets an announcement or an error message (if the id is not valid / doesn\'t exist).'
						}
					],
					POST: [
						{
							url: '/api/announcements',
							description: 'Creates an announcement. Gets the announcement data from post parameters, see model for more info about fields and validations... "https://github.com/Sediug/bloswbloswcar/blob/feature/server/server/model/announcement.js"'
						}
					],
					PUT: [
						{
							url: '/api/announcements/:id',
							description: 'Updates an announcement given its id. No field is mandatory, you can update any field you want as long as your data is valid agains the model. "https://github.com/Sediug/bloswbloswcar/blob/feature/server/server/model/announcement.js"'
						}
					],
					DELETE: [
						{
							url: '/api/announcements/:id',
							description: 'Deletes an announcement given its id.'
						}
					],
				},
				users: {
					GET: [
						{
							url: '/api/users',
							description: 'Gets all users.'
						},
						{
							url: '/api/users/:id',
							description: 'Gets an user profile data or an error message (if the id is not valid / doesn\'t exist).'
						}
					],
				}
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
api.routes.add(new Route({ path:'/announcements', method:['post'] }, announcements.create));
api.routes.add(new Route({ path:'/announcements/:id', method:['put'] }, announcements.update));
api.routes.add(new Route({ path:'/announcements/:id', method:['delete'] }, announcements.delete));

module.exports =  api;
