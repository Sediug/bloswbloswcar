const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
	title: String,
	description: String
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
