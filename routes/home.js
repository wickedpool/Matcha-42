var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	router = express.Router()

router.get('/', function(req, res, next) {
	if (req.session && req.session.login) {
		if (req.session.ok) {
			var login = req.session.login,
				sexe = req.session.sexe,
				age = req.session.age,
				interest = req.session.interest,
				descri = req.session.descri
			if (interest == "female") {
				connect.query("SELECT login, name, lastname, sexe, age, interest, mainpic FROM user WHERE sexe = ? AND city = ? AND login != ? AND mainpic IS NOT NULL", ["female", city, login], (err, rows, result) => {
					if (err) console.log(err)
				})
			} else if (interest == "male") {
				connect.query("SELECT login, name, lastname, sexe, age, interest, mainpic FROM user WHERE sexe = ? AND city = ? AND login != ? AND mainpic IS NOT NULL", ["male", city, login], (err, rows, result) => {
					if (err) console.log(err)
				})
			} else if (interest == "both") {
				connect.query("SELECT login, name, lastname, sexe, age, interest, mainpic FROM user WHERE city = ? AND login != ? AND mainpic IS NOT NULL", [city, login], (err, rows, result) => {
					if (err) console.log(err)
				})
			}
			var profile = rows
			res.render('home', { title: 'Express', profile: profile})
		} else {
			req.session.error = 'Vous devez completer votre profil pour aller sur cette page.'
			res.redirect('/profil')
		}
	} else {
		req.session.error = 'Vous devez vous connecter pour acceder a cette page.'
		res.redirect('/')
	}
})

module.exports = router
