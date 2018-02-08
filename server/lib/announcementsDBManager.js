const goblinDB = require("@goblindb/goblindb");
const indexBy = require('lodash.indexby');
const Announcement = require('../model/announcement');

function findAll(errorCb, cb) {
	Announcement.find({}, (err, announcements) => {
		if (err) {
			errorCb(err);
		} else {
			cb(indexBy(announcements, obj => obj._id));
		}
	});
}

/**
 * Using goblin db as an announcements db manager, the data will be saved to mongodb aswell
 * but goblin is used as a 'cache' to avoid unnecesary connections to mongo db. I know it's
 * not the best practice in the world but knowing this is a "for fun" project I want to test
 * Goblin DB in a production enviroment and this seens to be a good way to see how it works.
 */
module.exports = {
	goblin: null,
	initialized: false,
	init: function(done) {
		if (this.initialized) {
			done();
			return;
		}

		// Create goblin instance and load announcements
		try {
			this.goblin = goblinDB({mode: process.env.GOBLIN_DB_ENVIROMENT});
			this.goblin.set({});
			findAll(done, announcements => {
				this.goblin.set(announcements);
				this.initialized = true;
				done();
			});
		} catch(e) {
			done(e.message);
		}
	},
	get: function(id, errorCb) {
		if (id) {
			const announcement = this.goblin.get(id);

			if (announcement === undefined) {
				errorCb(`The announcement with the id ${ id } does not exist`);
			}

			return announcement;
		}

		return this.goblin.get();
	},
	add: function(announcement, errorCb) {
		announcement.created_dtm = Date.now();
		Announcement.create(announcement, (err, result) => {
			if (err) {
				errorCb(err);
				return;
			}
			this.goblin.set(result, String(result._id));
		});
	},
	update: function(id, announcement, errorCb) {
		announcement.updated_dtm = Date.now();
		Announcement.findOneAndUpdate({_id: id}, announcement, (err, result) => {
			if (err) {
				errorCb(err);
				return;
			}
			this.goblin.set(result, String(result._id));
		});
	},
	delete: function(id, errorCb) {
		Announcement.deleteOne({ _id: id }, err => {
			if (err) {
				errorCb(err);
				return;
			}
			findAll(announcements => this.goblin.set(announcements));
		});
	},
	updateGDB: function(errorCb, type, announcement) {
		// When someone is updating data using the api.
		if (this.initialized) {
			// Update all goblin db when no params or deleting.
			if (!type || type === 'delete' || !announcement) {
				findAll(errorCb, announcements => this.goblin.set(announcements));
			} else {
				this.goblin.set(announcement, String(announcement._id));
			}
		}
	}
};
