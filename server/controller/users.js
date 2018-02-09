const User = require('../model/user');

function error(gw, err) {
	gw.res.status(500).send({
		message: `Error al realizar la petición: ${err}`
	});
}

function get(gw) {
	if (gw.pathParams.id) {
		User.findById(gw.pathParams.id).lean().exec((err, user) => {
			err && error(gw, err);

			if (!user) {
				gw.res.status(404).send({message: `El usuario no existe`});
			}

			gw.json(user);
		});
	} else {
		User.find({}).lean().exec((err, users) => {
			err && error(gw, err);
			gw.json(users);
		});
	}
}

module.exports = { get };
