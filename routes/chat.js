var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	router = express.Router()

router.get('/:id', function(req, res, next) {
	if (req.session && req.session.login) {
		if (req.params.id) {
			connect.query("SELECT * from matched WHERE login = ? AND matched = ?", [req.session.login, req.params.id], (err, rows, result) => {
				if (err) console.log(err)
				if (rows[0] != undefined) {
					var talkto = req.params.id
					connect.query("SELECT * FROM message WHERE (login = ? AND user = ?) OR (login = ? AND user = ?) ORDER BY sendat ASC", [talkto, req.session.login, req.session.login, talkto], (err, rows, result) => {
						if (err) console.log(err)
						var message = rows
						res.render('chat', { title: 'Express', me: req.session.login, talkto: talkto, message: message })
					})
				} else {
					req.session.error = 'Vous n\'avez pas match avec ' + req.params.id
					res.redirect('/user/'+ req.params.id)
				}
			})
		} else {
			req.session.error = 'Aucun user n\'est selectionne'
			res.redirect('/message')
		}
	} else {
		req.session.error = 'Vous devez vous connecter pour acceder a cette page'
		res.redirect('/')
	}
})

module.exports = router
