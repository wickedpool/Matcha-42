var 	express = require('express'),
		connect = require('../config/database.js'),
		session = require('express-session'),
		regex = require('regex-email')
		router = express.Router(),

router.post('/', function(req, res) {
	var	login = req.body.login,
		name = req.body.name,
		lastname = req.body.lastname,
		email = req.body.email,
		gender = req.body.gender,
		city = req.body.city,
		age = req.body.age,
		pswd = req.body.pswd,
		repswd = req.body.repswd
	if (login && name && lastname && email && age && gender && city && pswd && repswd) {
		connect.query("SELECT * FROM user WHERE login = ? OR email = ?", [login, email], (err, rows, result) => {
			if (err) console.log(err)
		if (login.length > 60 || email.length > 150 || lastname.length > 60 || name.length > 60) {
			req.session.error = 'Champ trop long !'
			res.redirect('/')
		} else if (!regex.test(email)) {
			req.session.error = 'Format email invalide !'
			res.redirect('/')
		} else if (pswd != repswd) {
			req.session.error = 'Les mots de passe ne sont pas identiques!'
			res.redirect('/')
		} else {
			res.send("COUCOUUUU");
		}
		})
	} else {
		req.session.error = 'Veuillez remplir tous les champs.'
		res.redirect('/')
	}
})

module.exports = router
