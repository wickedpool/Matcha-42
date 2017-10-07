var express = require('express'),
	bcrypt = require('bcrypt'),
	connect = require('../config/database.js')
var mailer = require('nodemailer')
var router = express.Router()

router.get('/:hash', function(req, res, next) {
	if (req.params.hash) {
		connect.query("SELECT id FROM user WHERE hash = ?", [req.params.hash], (err, rows, result) => {
			if (err) console.log(err)
			if (rows[0] != undefined) {
				var id = rows[0].id
				res.render('reset', { id: id })
			}
		})
	} else {
		res.redirect('/')
	}
})

const	salt = 10

router.post('/', function(req, res, next) {
	if (req.body.pswd && req.body.repswd) {
		if (req.body.usr) {
			var	hash = bcrypt.hashSync(req.body.pswd, salt)
			connect.query("UPDATE user SET passwd = ? WHERE id = ?", [hash, req.body.id], (err) => {
				if (err) console.log(err)
				req.session.success = "Votre mot de passe a ete change"
				res.redirect('/login')
			})
		} else {
			req.session.erreur = "Un probleme est survenu"
			res.redirect('/')
		}
	} else {
		req.session.erreur = "Un probleme est survenu"
		res.redirect('/')
	}
	res.redirect('/')
})

module.exports = router
