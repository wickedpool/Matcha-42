var 	express = require('express'),
		connect = require('../config/database.js'),
		session = require('express-session'),
		router = express.Router();

router.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

router.post('/', function(req, res) {
	var	login = req.body.login,
		name = req.body.name,
		lastname = req.body.lastname,
		email = req.body.email,
		gender = req.body.gender,
		city = req.body.city;
		age = req.body.age,
	if (login && name && lastname && email && age && gender && city) {
		res.send("ON EST LA !");
	}
	else
		res.send("Veuillez remplir tous les champs");
});
module.exports = router;
