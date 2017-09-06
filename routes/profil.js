var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	bcrypt = require('bcrypt'),
	router = express.Router()

const	salt = 10

router.get('/', function(req, res, next) {
	res.render('profil', { title: 'Express' })
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
				res.redirect('/profil')
			} else if (!pswd.search(/\d/)) {
				req.session.error = 'Le mot de passe doit contenir au moins un chiffre!'
				res.redirect('/profil')
			} else if (pswd.search(RegexMin) == -1) {
				req.session.error = 'Le mot de passe doit contenir au moins une minuscule!'
				res.redirect('/profil')
			} else if (pswd.search(RegexMax) == -1) {
				req.session.error = 'Le mot de passe doit contenir au moins une majuscule!'
				res.redirect('/profil')
			} else if (pswd.search(RegexMore) == -1) {
				req.session.error = 'Le mot de passe ne peux pas contenir de caracteres spéciaux mise a part #, $, %, ^, &, *, ,, et . '
				res.redirect('/profil')
			} else if (pswd.length < 6) {
				req.session.error = 'Le mot de passe doit contenir au minimum 6 caracteres!'
				res.redirect('/profil')
			} else if (pswd.length > 15) {
				req.session.error = 'Le mot de passe doit contenir au maximum 15 caracteres!'
				res.redirect('/profil')
			} else if (rows[0]) {
				var hash = bcrypt.hashSync(pswd, salt)
				if (hash == rows[0].passwd) {
					req.session.login = login.toLowerCase()
					if (rows[0].mainpic) {
						req.session.ok = true
					}
					else
						req.session.ok = false
					if (rows[0].sexe)
						req.session.sexe = rows[0].sexe
						
				} else {
					req.session.error = 'Le nom d\'utilisateur ou le mot de passe n\'exise pas.'
					res.redirect('/profil')
				}
			} else {
				req.session.error = 'Le nom d\'utilisateur ou le mot de passe n\'exise pas.'
				res.redirect('/profil')
			}
		})
	} else {
		req.session.error = 'Veuillez remplir tous les champs.'
		res.redirect('/profil')
	}
})

module.exports = router
