const app = require('pillars');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const User = require('./model/user');
const callbackURL = `http://127.0.0.1:${ process.env.PORT }`;

// Passport configuration.
// Configure Passport authenticated session persistence.
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

// Add strategies
passport.use(
	new TwitterStrategy({
		consumerKey: process.env.TWITTER_KEY,
		consumerSecret: process.env.TWITTER_SECRET,
		callbackURL
	}, (token, tokenSecret, profile, callback)  => {
		console.log(profile);
		process.nextTick(() => {
			User.findOrCreate(
				{ githubId: profile.id },
				(err, user) => callback(err, user)
			);
		});
	})
);
passport.use(
	new GoogleStrategy({
		clientID: process.env.GOOGLE_KEY,
		clientSecret: process.env.GOOGLE_SECRET,
		callbackURL,
		scope: ['profile']
	}, (token, tokenSecret, profile, callback)  => {
		process.nextTick(() => {
			console.log(profile);
			User.findOrCreate(
				{ googleId: profile.id },
				(err, user) => callback(err, user)
			);
		});
	})
);
passport.use(
	new GitHubStrategy({
		clientID: process.env.GITHUB_KEY,
		clientSecret: process.env.GITHUB_SECRET,
		callbackURL
	}, (token, tokenSecret, profile, callback)  => {
		process.nextTick(() => {
			console.log(profile);
			User.findOrCreate(
				{ githubId: profile.id },
				(err, user) => callback(err, user)
			);
		});
	})
);

// Initialize Passport and restore authentication state, if any, from the
// session. Apply classic Connect middleware as Pillars middleware (Basic,
// only naming middleware)
app.middleware.add(new global.Middleware({id:"passportInitialize"}, passport.initialize()));
app.middleware.add(new global.Middleware({id:"passportSession"}, passport.session()));
