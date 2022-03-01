const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const VALID_PROVIDERS = new Set(['facebook', 'twitter', 'github']);
const UserSchema = new Schema({
	name: String,
	provider: String,
	profile: Object
});

mongoose.Promise = global.Promise;
const User = mongoose.model('User', UserSchema);

/**
 * Find a user in the database and if it doesn't exist then creates it.
 *
 * @param {string} provider A valid provider (one on the VALID_PROVIDERS list).
 * @param {object} profile The user profile (so in case it doesn't exist we can create it)
 * @param {function} cb Callback. Receive error (if any) and the stored user profile.
 * @returns {void} None.
 */
User.findOrCreate = function(provider, profile, cb) {
	if (!VALID_PROVIDERS.has(provider)) {
		return cb(`User model error. Invalid provider ${ provider } on findOrCreate method.`);
	}

	User.findOne({
		provider,
		'profile.id': profile.id
	}, function(err, user) {
		if (err) {
			return cb(err);
		}

		if (user) {
			return cb(null, user);
		}

		// No user was found, so create a new user with values from Facebook, Twitter,
		// Github... (all the profile and stuff)
		user = new User({
			name: profile.displayName,
			provider,
			profile
		});
		user.save(function(err) {
			return cb(err, user);
		});
	});
};


module.exports = User;
