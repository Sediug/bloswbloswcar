const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: String,
	githubId: Number,
	googleId: Number,
	twitterId: Number
});

mongoose.Promise = global.Promise;
module.exports = mongoose.model('User', UserSchema);
