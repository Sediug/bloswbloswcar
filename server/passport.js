/* global Middleware */
const app = require('pillars');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const User = require('./model/user');

// Passport configuration.
// Configure Passport authenticated session persistence.
passport.serializeUser((user, cb) => {
	cb(null, {
		id: user._id,
		provider: user.provider
	});
});
passport.deserializeUser((obj, cb) => {
	User.findOne({
		provider: obj.provider,
		_id: obj.id
	}, cb);
});

// Add strategies
passport.use(
	new TwitterStrategy({
		consumerKey: process.env.TWITTER_KEY,
		consumerSecret: process.env.TWITTER_SECRET,
		callbackURL: '/auth/login/twitter/return'
	}, (token, tokenSecret, profile, callback)  => {
		process.nextTick(() => {
			User.findOrCreate('twitter', profile, (err, user) => callback(err, user));
		});
	})
);
passport.use(
	new GoogleStrategy({
		clientID: process.env.GOOGLE_KEY,
		clientSecret: process.env.GOOGLE_SECRET,
		callbackURL: '/auth/login/google/return',
		scope: ['profile']
	}, (token, tokenSecret, profile, callback)  => {
		process.nextTick(() => {
			User.findOrCreate('google', profile, (err, user) => callback(err, user));
		});
	})
);
passport.use(
	new GitHubStrategy({
		clientID: process.env.GITHUB_KEY,
		clientSecret: process.env.GITHUB_SECRET,
		callbackURL: '/auth/login/github/return'
	}, (token, tokenSecret, profile, callback)  => {
		process.nextTick(() => {
			User.findOrCreate('github', profile, (err, user) => callback(err, user));
		});
	})
);

// Initialize Passport and restore authentication state, if any, from the
// session. Apply classic Connect middleware as Pillars middleware (Basic,
// only naming middleware)
app.middleware.add(new Middleware({ id:"passportInitialize" }, passport.initialize()));
app.middleware.add(new Middleware({ id:"passportSession" }, passport.session()));
