var express = require('express'),
	connect = require('../config/database.js')
var router = express.Router()

router.get('/', function(req, res, next) {
	if (req.session && req.session.login) {
		connect.query("SELECT * FROM notif WHERE login = ? ORDER BY sendat DESC", [req.session.login], (err, rows, result) => {
			if (err) console.log(err)
			if (rows[0] != undefined) {
				var notif = rows
				connect.query("SELECT readed FROM notif WHERE login = ? LIMIT 1", [req.session.login], (err1, rows1, result1) => {
					if (err1) console.log(err1)
					console.log(rows1[0])
					if (rows1[0] == undefined)
						res.render('notif', { title: 'Express', notif: notif, checked: undefined })
					else
						res.render('notif', { title: 'Express', notif: notif, checked: true })
				})
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
