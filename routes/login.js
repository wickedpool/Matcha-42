var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	bcrypt = require('bcrypt'),
	router = express.Router()

router.get('/', function(req, res, next) {
	res.render('login', { title: 'Express' })
})

router.post('/', function(req, res) {
	var login = req.body.login,
		pswd = req.body.pswd
	var RegexMin = /[a-z]/,
		RegexMax = /[A-Z]/,
		RegexMore = /[a-zA-Z-0-9\#\$\%\^\&\*\,\.]/
	if (login && pswd) {
		connect.query("SELECT * FROM user WHERE login = ? LIMIT 1", [login], (err, rows, result) => {
			if (err) {
				req.session.error = 'Le nom d\'utilisateur ou le mot de passe n\'exise pas!'
				res.redirect('/login')
			} else if (!pswd.search(/\d/)) {
				req.session.error = 'Le mot de passe doit contenir au moins un chiffre!'
				res.redirect('/login')
			} else if (pswd.search(RegexMin) == -1) {
				req.session.error = 'Le mot de passe doit contenir au moins une minuscule!'
				res.redirect('/login')
			} else if (pswd.search(RegexMax) == -1) {
				req.session.error = 'Le mot de passe doit contenir au moins une majuscule!'
				res.redirect('/login')
			} else if (pswd.search(RegexMore) == -1) {
				req.session.error = 'Le mot de passe ne peux pas contenir de caracteres spéciaux mise a part #, $, %, ^, &, *, ,, et . '
				res.redirect('/login')
			} else if (pswd.length < 6) {
				req.session.error = 'Le mot de passe doit contenir au minimum 6 caracteres!'
				res.redirect('/login')
			} else if (pswd.length > 15) {
				req.session.error = 'Le mot de passe doit contenir au maximum 15 caracteres!'
				res.redirect('/login')
			} else if (rows[0]) {
                if (bcrypt.compareSync(pswd, rows[0].passwd)) { 
					req.session.login = login.toLowerCase()
					if (rows[0].mainpic) {
						req.session.ok = true
						req.session.orientation = rows[0].orientation
						req.session.lastname = rows[0].lastname
						req.session.name = rows[0].name
						req.session.sexe = rows[0].sexe
						req.session.mainpic = rows[0].mainpic
						req.session.success = "Vous êtes maintenant connecté"
						res.redirect('/home')
					} else {
						req.session.ok = false
						req.session.sexe = rows[0].sexe
						req.session.lastname = rows[0].lastname
						req.session.name = rows[0].name
						req.session.info = 'Veuillez remplir vos informations personnelles.'
						req.session.success = "Vous êtes maintenant connecté"
						res.redirect('/profil')
					}
				} else {
					req.session.error = 'Le mot de passe ou le nom d\'utilisateur n\'existe pas.'
					res.redirect('/login')
				}
			} else {
				req.session.error = 'Le nom d\'utilisateur ou le mot de passe n\'exise pas.'
				res.redirect('/login')
			}
		})
	} else {
		req.session.error = 'Veuillez remplir tous les champs.'
		res.redirect('/login')
	}
})

module.exports = router
