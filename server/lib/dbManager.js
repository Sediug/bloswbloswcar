const goblinDB = require("@goblindb/goblindb")
const announcementsDB = 'announcements';
const usersDB = 'users';
let database = null;

module.exports = function () {
	if (database === null) {
		// Create DB instance.
		database = goblinDB({mode: 'development'});
		database.set({
			[announcementsDB]: {},
			[usersDB]: {}
		}); // Provisional until a bug gets fixed on goblin.

		/* Check if the core elements exist. If not then create those elements.
		const data = database.get();
		let update = false;

		if (data[announcementsDB] === undefined) {
			data[announcementsDB] = {};
			update = true;
		}

		if (data[usersDB] === undefined) {
			data[usersDB] = {};
			update = true;
		}

		if (update) {
			database.set(data);
		}*/
	}

	return database;
}
