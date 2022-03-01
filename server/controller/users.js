const User = require('../model/user');

function error(gw, err) {
	gw.error(500, Error(`Error al realizar la petición: ${err}`));
}

function get(gw) {
	if (gw.pathParams.id) {
		User.findById(gw.pathParams.id).lean().exec((err, user) => {
			err && error(gw, err);

			if (!user) {
				gw.json({message: `El usuario no existe`});
			}

			gw.json(user, {deep: 0});
		});
	} else {
		User.find({}).lean().exec((err, users) => {
			err && error(gw, err);
			gw.json(users, {deep: 0});
		});
	}
}

module.exports = { get };
