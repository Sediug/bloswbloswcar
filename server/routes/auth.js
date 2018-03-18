/* global Route */
const passport = require('passport');

// login urls.
const loginTwitterUrl = '/auth/login/twitter';
const loginGoogleUrl = '/auth/login/google';
const loginGitHubUrl = '/auth/login/github';
const loginSuccess = '/';

// Create new Route container
const auth = new Route(
	{
		id: 'auth',
		path:'/auth',
		method:["get"],
		session: true    // All sub-routes inherited session support
	},
	gw => {
		// Send links to login options:
		gw.json({
			logout: '/auth/logout',
			loginTwitterUrl,
			loginGitHubUrl,
			loginGoogleUrl
		}, {deep: 0});

		// api info
		gw.json({
			description: 'API v1',
			endPoints: {
				auth: {
					GET: [
						{
							url: loginTwitterUrl,
							description: 'Login using twitter.'
						},
						{
							url: loginGitHubUrl,
							description: 'Login using github.'
						},
						{
							url: loginGoogleUrl,
							description: 'Login using google. Not yet working...'
						},
						{
							url: '/auth/logout',
							description: 'Logout and remove session. Not yet working...'
						}
					]
				}
			}
		}, {deep: 0});
	}
);

// Create GitHub login and callback url
// > /auth/login/github & /auth/login/github/return
const lgGithub = new Route(
	{
		id: 'github',
		path: '/login/github',
		method:["get"]
	},
	passport.authenticate('github')
);

lgGithub.routes.add(new Route(
	{
		id: 'ghReturn',
		path: 'return',
		method:["get"]
	},
	passport.authenticate('github', {
		successRedirect: loginSuccess,
		failureRedirect: '/auth/login/error?from=github'
	})
));

// Create Google login and callback url
const lgGoogle = new Route(
	{
		id: 'google',
		path: '/login/google',
		method:["get"]
	},
	passport.authenticate('google')
);

lgGoogle.routes.add(new Route(
	{
		id: 'ggReturn',
		path: 'return',
		method:["get"]
	},
	passport.authenticate('google', {
		successRedirect: loginSuccess,
		failureRedirect: '/auth/login/error?from=google'
	})
));

// Create Twitter login and callback url
const lgTwitter= new Route(
	{
		id: 'twitter',
		path: '/login/twitter',
		method:["get"]
	},
	passport.authenticate('twitter')
);

lgTwitter.routes.add(new Route(
	{
		id: 'ggReturn',
		path: 'return',
		method:["get"]
	},
	passport.authenticate('twitter', {
		successRedirect: loginSuccess,
		failureRedirect: '/auth/login/error?from=twitter'
	})
));

// Create login error route
const lgError = new Route(
	{
		id: 'login-error',
		path:'/error',
		method:["get"]
	},
	gw => {
		const message = `Error de autentificación usando ${ gw.params.from }.`;
		gw.html(`
			<div>
				<p>${ message }</p>
				<p>Autentificación fallida.</p>
			</div>
		`);
	}
);

// Create log out route
const logout = new Route(
	{
		id: 'logOut',
		path: '/logout',
		method:["get"]
	}, gw => {
		gw.req.user = undefined;
		gw.session = undefined;
		gw.req.logout();
		gw.redirect('/');
	}
);

// Add sub-routes to login
auth.routes.add(lgGithub);
auth.routes.add(lgGoogle);
auth.routes.add(lgTwitter);
auth.routes.add(lgError);
auth.routes.add(logout);

// Temp view session user route
auth.routes.add(new Route(
	{
		path: 'view'
	}, gw => {
		if (gw.req.user) {
			return gw.json(gw.req.user._doc.profile, {deep: 0});
		}

		gw.error(204, 'There is no user logged in');
	}
));

module.exports =  auth;
