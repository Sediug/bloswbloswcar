const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
	user_id: String, // Foreign key, user id.
	title: {
		type: String,
		required: [true, 'El título del anuncio no puede estar vacio.']
	},
	description: String,
	date: {
		type: Date,
		required: [true, 'La fecha del viaje no puede estar vacia.']
	},
	from: {
		type: String,
		required: [true, 'Es obligatorio indicar el lugar de salida']
	},
	to: {
		type: String,
		required: [true, 'Es obligatorio indicar el lugar de destino']
	},
	availableSeats: Number,
	full: { type: Boolean, default: false },
	tags: {
		type: String,
		enum: ['fumar', 'mascotas', 'música']
	},
	created_dtm: { type: Date, default: Date.now() },
	updated_dtm: { type: Date, default: Date.now() }
});

mongoose.Promise = global.Promise;
module.exports = mongoose.model('Announcement', AnnouncementSchema);
