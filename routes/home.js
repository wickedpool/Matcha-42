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
				city = req.session.city
			if (interest == "female" && sexe == "male") {
				connect.query("SELECT login, name, lastname, sexe, age, interest, description, mainpic FROM user WHERE sexe = ? AND city = ? AND login != ? AND mainpic IS NOT NULL AND interest = ?", ["female", city, login, "male"], (err, rows, result) => {
					if (err) console.log(err)
					var profile = rows
					res.render('home', { title: 'Express', profile: profile })
				})
			} else if (interest == "male" && sexe == "female") {
				connect.query("SELECT login, name, lastname, sexe, age, interest, description, mainpic FROM user WHERE sexe = ? AND city = ? AND login != ? AND mainpic IS NOT NULL AND interest = ?", ["male", city, login, "female"], (err, rows, result) => {
					if (err) console.log(err)
					var profile = rows
					res.render('home', { title: 'Express', profile: profile })
				})

			} else if (interest == "both" && sexe == "male") {
				connect.query("SELECT login, name, lastname, sexe, age, interest, description, mainpic FROM user WHERE sexe = ? AND city = ? AND login != ? AND mainpic IS NOT NULL AND interest = ?", ["male", city, login, "female"], (err, rows, result) => {
					if (err) console.log(err)
					var profile = rows
					res.render('home', { title: 'Express', profile: profile })
				})

			} else if (interest == "both" && sexe == "female") {
				connect.query("SELECT login, name, lastname, sexe, age, interest, description, mainpic FROM user WHERE city = ? AND login != ? AND mainpic IS NOT NULL AND interest = ?", [city, login, "female"], (err, rows, result) => {
					if (err) console.log(err)
					var profile = rows
					res.render('home', { title: 'Express', profile: profile })
				})
			} else {
				connect.query("SELECT login, name, lastname, sexe, age, interest, description, mainpic FROM user WHERE city = ? AND login != ? AND mainpic IS NOT NULL", [city, login], (err, rows, result) => {
					if (err) console.log(err)
					var profile = rows
					res.render('home', { title: 'Express', profile: profile })
				})

			}
		} else {
			req.session.error = 'Vous devez completer votre profil pour aller sur cette page.'
			res.redirect('/profil')
		}
	} else {
		req.session.error = 'Vous devez vous connecter'
		res.redirect('/')
	}
})

router.post('/tri', function(req, res, next) {
	if (req.session && req.session.login) {
		console.log(req.body.defau)
		console.log(req.body.famous)
		console.log(req.body.tags)
		res.redirect('/home')
	} else {
		req.session.error = 'Vous devez vous connecter'
		res.redirect('/')
	}
})

module.exports = router
