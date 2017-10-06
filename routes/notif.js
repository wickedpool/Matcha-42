var express = require('express'),
	connect = require('../config/database.js')
var router = express.Router()

router.get('/', function(req, res, next) {
	if (req.session && req.session.login) {
		connect.query("SELECT * FROM notif WHERE login = ?", [req.session.login], (err, rows, result) => {
			if (err) console.log(err)
			if (rows[0] != undefined) {
				var notif = rows
				res.render('notif', { title: 'Express', notif: notif })
			} else {
				var notif = undefined
				res.render('notif', { notif: notif })
			}
		})
	} else {
		req.session.error = 'Vous devez vous connecter pour acceder a cette page'
		res.redirect('/')
	}
})

module.exports = router
