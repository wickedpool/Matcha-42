var express = require('express'),
	connect = require('../config/database.js')
var router = express.Router()

router.get('/', function(req, res, next) {
	if (req.session && req.session.login) {
		connect.query("SELECT * FROM notif WHERE login = ? ORDER BY sendat DESC LIMIT 25", [req.session.login], (err, rows, result) => {
			if (err) console.log(err)
			if (rows[0] != undefined) {
				var notif = rows
				connect.query("SELECT readed FROM notif WHERE login = ? LIMIT 1", [req.session.login], (err1, rows1, result1) => {
					if (err1) console.log(err1)
					if (rows1[0] == undefined)
						res.render('notif', { title: 'Express', notif: notif })
					else
						res.render('notif', { title: 'Express', notif: notif })
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

router.get('/:id', function(req, res, next) {
	if (req.session && req.session.login) {
		if (req.params.id) {
			connect.query("SELECT MAX(id) as max FROM notif", (err, rows, result) => {
				if (req.params.id <= rows[0].max && req.params.id >= 0) {
					connect.query("UPDATE notif SET readed = 1 WHERE login = ? AND id = ?", [req.session.login, req.params.id], (err) => {
						if (err) console.log(err)
						res.locals.cheecked = undefined
						req.session.success = 'C\'est lu !'
						res.redirect('/notif')
					})
				} else {
					req.session.error = 'bad id'
					res.redirect('/notif')
				}
			})
		} else {
			req.session.error = 'bad param'
			res.redirect('/notif')
		}
	} else {
		req.session.error = 'Vous devez vous connecter pour acceder a cette page'
		res.redirect('/')
	}
})

module.exports = router
