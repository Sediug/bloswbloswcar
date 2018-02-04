const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
	title: String,
	description: String,
	date: Date,
	created_dtm: Date,
	updated_dtm: Date
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
