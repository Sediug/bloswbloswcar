const goblinDB = require("@goblindb/goblindb");
const indexBy = require('lodash.indexby');
const Announcement = require('../model/announcement');

function findAll(cb) {
	Announcement.find({}).lean(true).exec((err, announcements) => {
		if (err) {
			return cb(err, {});
		}

		cb(null,
			indexBy(announcements, obj => {
				obj._id = String(obj._id);
				return obj._id;
			})
		);
	});
}

function find(id, cb) {
	Announcement.findById(id).lean(true).exec((err, announcement) => {
		if (err) {
			return cb(err, {});
		}

		cb(null, announcement);
	});
}

/**
 * Using goblin db as an announcements db manager, the data will be saved to mongodb
 * aswell but goblin is used as a 'cache' to avoid unnecesary connections to mongo db.
 * I know it's not the best practice in the world but knowing this is a "for fun" project
 * I want to test Goblin DB in a production enviroment and this seens to be a good way to
 * see how it works.
 */
module.exports = {
	goblin: null,
	initialized: false,
	init: function(done) {
		if (this.initialized) {
			done(null);
			return;
		}

		// Create goblin instance and load announcements
		this.goblin = goblinDB({mode: process.env.GOBLIN_DB_ENVIROMENT});
		this.goblin.set({});

		findAll((err, announcements) => {
			this.goblin.set(announcements);
			this.initialized = true;
			done(err);
		});
	},
	get: function(id, cb) {
		if (id) {
			const announcement = this.goblin.get(id);

			if (announcement === undefined) {
				cb(`No existe ningún anuncio con el id ${ id }`, null);
			}

			cb(null, announcement);
		}

		cb(null, this.goblin.get());
	},
	create: function(data, cb) {
		const announcement = Object.assign(new Announcement(), data);
		data.created_dtm = Date.now();

		announcement.save((err, result) => {
			if (err) {
				return cb(err, result);
			}

			// Find as to store / get as JSON not mongo doc
			find(result._id, (error, announcement) => {
				this.goblin.set(announcement, String(result._id));
				cb(null, announcement);
			});
		});
	},
	update: function(id, announcement, cb) {
		announcement.updated_dtm = Date.now();

		if (announcement.created_dtm) {
			delete announcement.created_dtm;
		}

		Announcement.findOneAndUpdate(
			{ _id: id }, // find condition
			announcement, // update data
			{ lean: true }, // get result as JSON not mongo doc
			(err, result) => {
				if (err) {
					return cb(err, result);
				}

				this.goblin.set(result, String(result._id));
				cb(null, result);
			}
		);
	},
	delete: function(id, cb) {
		Announcement.findById(id, (err, announcement) => {
			if (err) {
				return cb(err, false);
			}

			// If exist then remove.
			announcement.remove(err => {
				if (err) {
					return cb(err, false);
				}

				const announcements = this.goblin.get();
				delete announcements[id];
				this.goblin.set(announcements);
				cb(null, true);
			});
		});
	}
};
