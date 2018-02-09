const goblinDB = require("@goblindb/goblindb");
const indexBy = require('lodash.indexby');
const Announcement = require('../model/announcement');

function findAll(cb) {
	Announcement.find({}, (err, announcements) => {
		if (err) {
			return cb(err, {});
		}

		cb(null, indexBy(announcements, obj => obj._id));
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

			this.goblin.set(result, String(result._id));
			cb(null, result);
		});
	},
	update: function(id, announcement, cb) {
		announcement.updated_dtm = Date.now();

		if (announcement.created_dtm) {
			delete announcement.created_dtm;
		}

		Announcement.findOneAndUpdate({_id: id}, announcement, (err, result) => {
			if (err) {
				return cb(err, result);
			}

			this.goblin.set(result, String(result._id));
			cb(null, result);
		});
	},
	delete: function(id, cb) {
		Announcement.findById(id, (err, announcement) => {
			if (err) {
				return cb(err, false);
			}

			announcement.remove(err => {
				if (err) {
					return cb(err, false);
				}

				findAll((err, announcements) => {
					this.goblin.set(announcements);
					cb(err, true);
				});
			});
		});
	}
};
