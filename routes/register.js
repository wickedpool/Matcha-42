var express = require('express'),
	router = express.Router();

router.post('/', function(req, res) {
	var login = req.body.login,
		name = req.body.name,
		lastname = req.body.lastname,
		email = req.body.email,
		age = req.body.age,
		gender = req.body.gender,
		city = req.body.city,
		description = req.body.decription;
	if (login && name && lastname && email && age && gender && city)
		res.send("ON EST LA !");
	else
		res.send("Veuillez remplir tous les champs");
});
module.exports = router;
