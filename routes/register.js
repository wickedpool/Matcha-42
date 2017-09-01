var 	express = require('express'),
		connect = require('../config/database.js'),
		session = require('express-session'),
		regex = require('regex-email'),
		bcrypt = require('bcrypt'),
		router = express.Router()

const	salt = 10

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
	var RegexMin = /[a-z]/,
		RegexMax = /[A-Z]/,
		RegexBoth = /[a-zA-Z]/,
		RegexAll = /[a-zA-Z0-9]/,
		RegexMore = /[a-zA-Z-0-9\#\$\%\^\&\*\,\.]/,
		RegexDate = /^\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/
	var	hash = bcrypt.hashSync(pswd, salt)
	if (login && name && lastname && email && age && gender && city && pswd && repswd) {
		connect.query("SELECT * FROM user WHERE login = ? OR email = ?", [login, email], (err, rows, result) => {
			if (err) console.log(err)
		if (login.length > 60 || email.length > 150 || lastname.length > 60 || name.length > 60) {
			req.session.error = 'Champ trop long!'
			res.redirect('/')
		} else if (!regex.test(email)) {
			req.session.error = 'Format email invalide!'
			res.redirect('/')
		} else if (login.search(RegexAll)) {
			req.session.error = 'Le login ne peux comporter que des caracteres de A a Z et des chiffres!'
			res.redirect('/')
		} else if (name.search(RegexBoth) || lastname.search(RegexBoth)) {
			req.session.error = 'Votre nom ne peux pas contenir de caracteres autres que l\'alphabet meme si vous avez un nom compose!'
			res.redirect('/')
		} else if (city.search(RegexBoth)) {
			req.session.error = 'Le nom de votre ville ne peux pas comporter d\'accents, ou autre caractere special!'
			res.redirect('/')
		} else if (pswd != repswd) {
			req.session.error = 'Les mots de passe ne sont pas identiques!'
			res.redirect('/')
		} else if (!pswd.search(/\d/)) {
			req.session.error = 'Le mot de passe doit contenir au moins un chiffre!'
			res.redirect('/')
		} else if (pswd.search(RegexMin) == -1) {
			req.session.error = 'Le mot de passe doit contenir au moins une minuscule!'
			res.redirect('/')
		} else if (pswd.search(RegexMax) == -1) {
			req.session.error = 'Le mot de passe doit contenir au moins une majuscule!'
			res.redirect('/')
		} else if (pswd.search(RegexMore) == -1) {
			req.session.error = 'Le mot de passe ne peux pas contenir de caracteres speciaux mise a part #, $, %, ^, &, *, ,, et . '
			res.redirect('/')
		} else if (pswd.length < 6) {
			req.session.error = 'Le mot de passe doit contenir au minimum 6 caracteres!'
			res.redirect('/')
		} else if (!age.search(RegexDate)) {
			req.session.error = 'Le format de la date n\'est pas valide!'
			res.redirect('/')
		} else if (name.length < 3 || lastname.length < 3) {
			req.session.error = 'Le nom fait moins de 2 caracteres'
			res.redirect('/')
		} else {
			connection.query("INSERT INTO user SET login = ?, name = ?, lastname = ?, email = ?, passwd = ?, age = ?, sexe = ?, city = ?", [login, name, lastname, email, hash, gender, city], (err, rows, result) => {
				if (err) console.log(err)
			})
		}
		})
	} else {
		req.session.error = 'Veuillez remplir tous les champs.'
		res.redirect('/')
	}
})

module.exports = router
