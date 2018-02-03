const goblinDB = require("@goblindb/goblindb");
const indexBy = require('lodash.indexby');
const Announcement = require('./model/announcement');

/**
 * Using goblin db as an announcements db manager, the data will be saved to mongodb aswell
 * but goblin is used as a 'cache' to avoid unnecesary connections to mongo db. I know it's
 * not the best practice in the world but knowing this is a "for fun" project I want to test
 * Goblin DB in a production enviroment and this seens to be a good way to see how it works.
 */
let goblin = null;

module.exports = {
	init: () => {
		// Create goblin instance and load announcements
		goblin = goblinDB({mode: process.ensd.GOBLIN_DB_ENVIROMENT});
		Announcement.find({}, (err, announcements) => {
			if (err) throw err;
			goblin.set({
				announcements: indexBy(announcements, obj => obj._id)
			});
		});
	},
	get: (id) => {
		if (id) {
			const announcement = goblin.get('announcements.' + id);

			if (announcement === undefined) {
				throw Error(`The announcement with the id ${ id } does not exist`);
			}

			return announcement;
		}

		return goblin.get();
	},
	add: (announcement) => {
		Announcement.create(announcement, (err, result) => {
			if (err) throw err;
			goblin.set(result, 'announcements.' + result._id);
		});
	},
	update: (id, announcement) => {
		Announcement.findOneAndUpdate({_id: id}, announcement, (err, result) => {
			if (err) throw err;
			goblin.set(result, 'announcements.' + result._id);
		});
	},
	delete: (id) => {
		Announcement.deleteOne({ _id: id }, err => {
			if (err) throw err;
			goblin.set({deleted: true}, 'announcements.' + id);
		});
	}
};
