const DB_BASE_NAME = 'announcements';

module.exports = function(db) {
	/**
	 * Gets an announcement given its id.
	 * 
	 * @param {int} id The id of the requested announcement.
	 * @returns {object} The stored announcement. 
	 */
	function get(id) {
		return db.get(DB_BASE_NAME + '.' + id);
	}

	/**
	 * Gets all announcements, stored in the database, indexed by their ids.
	 * 
	 * @returns {object} All stored announcements.
	 */
	function getAll() {
		return db.get(DB_BASE_NAME);
	}

	/**
	 * Creates or updates an announcement
	 * 
	 * @param {object} data The data of the announcement.
	 * @returns void 
	 */
	function save(data) {
		if (!data.id || !db.get(DB_BASE_NAME + '.' + data.id)) {
			data.id = getNextId();
			db.set(data, DB_BASE_NAME + '.' + data.id);
		} else {
			db.update(data, DB_BASE_NAME + '.' + data.id);
		}
	}

	/**
	 * Delete an announcement given its id
	 * 
	 * @param {int} id The id announcement.
	 * @returns void 
	 */
	function deleteFnc(id) {}

	// Internal use only
	let lastId = null;
	function getNextId() {
		if (lastId === null) {
			const orderedIds = Object.keys(getAll()).sort(function(a, b) {
				a = parseInt(a);
				b = parseInt(b);

				if (a < b) {
					return -1;
				}

				if (a > b) {
					return 1;
				}

				return 0;
			});
			
			lastId = orderedIds[orderedIds.length - 1] || 0;
		}

		return lastId++;
	}

	return {
		get: get,
		getAll: getAll,
		save: save,
		delete: deleteFnc
	};
};