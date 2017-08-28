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
		age = req.body.age;
	if (login && name && lastname && email && age && gender && city) {
		connect.query("SELECT * FROM user WHERE login = ? OR email = ?", [login, email], (err, rows, result) => {
	if (err) console.log(err)
	else
})
		res.send("ON EST LA !");
	}
	else
		res.redirect("/?err=Veuillez remplir tous les champs");
});
module.exports = router;
