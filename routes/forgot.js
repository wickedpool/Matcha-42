var express = require('express'),
	connect = require('../config/database.js')
var mailer = require('nodemailer')
var regex = require('regex-email')
var router = express.Router()

router.get('/', function(req, res, next) {
	res.render('forgot')
})	

router.post('/', function(req, res, next) {
	var mail = req.body.email
	if (!regex.test(mail)) {
		req.session.error = 'Format email invalide!'
		res.redirect('/')
	} else {
		connect.query('SELECT hash, login FROM user WHERE email = ?', [mail], (err, rows, result) => {
			if (err) console.log(err)
			if (rows[0] != undefined) {
				var hash = rows[0].hash
				var login = rows[0].login
				console.log("SA VA MAILER SA MERE")
					var smtpTransport = mailer.createTransport({
						service: 'Gmail',
						auth: {
							user: 'giraudthomas38@gmail.com',
							pass: 'rmpjvgyd'
						}
					})
					var mailOptions = {
						to: mail,
						from: 'wickedpool@matcha.fr',
						subject: 'Matcha Password Reset',
						text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
						'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
						'http://localhost:8080' + '/reset/' + hash + '\n\n' +
						'If you did not request this, please ignore this email and your password will remain unchanged.\n'
					}
					smtpTransport.sendMail(mailOptions, function(err) {
						if (err) console.log(err)
						else {
							req.session.success = "un email vous a ete envoye"
							res.redirect('home')
						}
					})
			} else {
				req.session.error = 'l\'email ne correspond a aucun compte'
				res.redirect('/forgot')
			}
		})
	}
})

module.exports = router
