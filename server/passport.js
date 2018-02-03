const app = require('pillars');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const User = require('./model/user');

// Configure Passport authenticated session persistence.
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

// Add strategies
passport.use(
	new TwitterStrategy({
		consumerKey: process.env.TWITTER_KEY,
		consumerSecret: process.env.TWITTER_SECRET
	}, (token, tokenSecret, profile, callback)  => {
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
		clientSecret: process.env.GOOGLE_SECRET
	}, (token, tokenSecret, profile, callback)  => {
		process.nextTick(() => {
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
		clientSecret: process.env.GITHUB_SECRET
	}, (token, tokenSecret, profile, callback)  => {
		process.nextTick(() => {
			User.findOrCreate(
				{ githubId: profile.id },
				(err, user) => callback(err, user)
			);
		});
	})
);

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());
