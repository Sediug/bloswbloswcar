/* global Route */
const routes = require('pillars').routes;
const passport = require('passport');
const UserModel = require('../model/user');

// Login urls.
const loginTwitterUrl = '/login/twitter';
const loginGoogleUrl = '/login/google';
const loginGitHubUrl = '/login/github';
const loginSuccess = '/login/view-session';

// Create new Route container
const Login = Route(
	{
		id: 'login',
		path:'/login',
		method:["get"],
		session: true    // All sub-routes inherited session support
	},
	gw => {
		// Send links to login options:
		gw.json({ loginTwitterUrl, loginGitHubUrl, loginGoogleUrl }, {deep: 0});
	}
);

// Add GitHub login
Login.routes.add(new Route(
	{
		id: 'github',
		path: 'github',
		method:["get"]
	},
	passport.authenticate('github', {
		successRedirect: loginSuccess,
		failureRedirect: '/login/error?from=github'
	})
));

// Add Google login
Login.routes.add(new Route(
	{
		id: 'google',
		path: 'google',
		method:["get"]
	},
	passport.authenticate('google', {
		successRedirect: loginSuccess,
		failureRedirect: '/login/error?from=google'
	})
));

// Add Twitter login
Login.routes.add(new Route(
	{
		id: 'twitter',
		path: 'twitter',
		method:["get"]
	},
	passport.authenticate('twitter', {
		successRedirect: loginSuccess,
		failureRedirect: '/login/error?from=twitter'
	})
));

// Add login eror route
Login.routes.add(new Route(
	{
		id: 'login-error',
		path:'/error',
		method:["get"]
	},
	gw => {
		const message = `Error intentando hacer el login usando ${ gw.params.from }.`;
		gw.html(`
			<div>
				<p>${ message }</p>
				<p>Autentificación fallida.</p>
			</div>
		`);
	}
));

// Add view session
Login.routes.add(new Route(
	{
		id: 'view-session',
		path:'/session',
		session: true
	},
	gw => {
		gw.json(gw.session, {deep:0});
	}
));

// Users routes
// Create new Route container
const Users = Route(
	{
		id: 'users',
		path:'/users',
		method:["get"],
		session: true
	},
	gw => {
		// Send links to login options:
		gw.json({allUsers: '/users/all' }, {deep: 0});
	}
);

Users.routes.add(new Route(
	{
		id: 'all-users',
		path: '/all',
		method:["get"]
	},
	gw => {
		UserModel.find({}, (err, users) => {
			if (err) console.error(err);
			gw.json(users);
		});
	}
));

// Add controller routes to the pillars project.
routes.add(Login);
routes.add(Users);
