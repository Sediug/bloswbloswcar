const goblinDB = require("@goblindb/goblindb");
const indexBy = require('lodash.indexby');
const moment = require('moment');
const Announcement = require('../model/announcement');

/**
 * Using goblin db as an announcements db manager, the data will be saved to mongodb aswell
 * but goblin is used as a 'cache' to avoid unnecesary connections to mongo db. I know it's
 * not the best practice in the world but knowing this is a "for fun" project I want to test
 * Goblin DB in a production enviroment and this seens to be a good way to see how it works.
 */
module.exports = {
	goblin: null,
	init: function(done) {
		// Create goblin instance and load announcements
		this.goblin = goblinDB({mode: process.env.GOBLIN_DB_ENVIROMENT});
		Announcement.find({}, (err, announcements) => {
			if (err) throw err;
			this.goblin.set({});
			this.goblin.set(indexBy(announcements, obj => obj._id));
			done();
		});
	},
	get: function(id) {
		if (id) {
			const announcement = this.goblin.get(id);

			if (announcement === undefined) {
				throw Error(`The announcement with the id ${ id } does not exist`);
			}

			return announcement;
		}

		return this.goblin.get();
	},
	add: function(announcement) {
		console.log(moment(new Date()).format('L'));
		announcement.created_dtm = moment(new Date()).format('L');
		Announcement.create(announcement, (err, result) => {
			if (err) throw err;
			this.goblin.set(result, String(result._id));
		});
	},
	update: function(id, announcement) {
		announcement.updated_dtm = moment(new Date()).format('L');
		Announcement.findOneAndUpdate({_id: id}, announcement, (err, result) => {
			if (err) throw err;
			this.goblin.set(result, String(result._id));
		});
	},
	delete: function(id) {
		Announcement.deleteOne({ _id: id }, err => {
			if (err) throw err;
			this.goblin.set({deleted: true}, id);
		});
	}
};
