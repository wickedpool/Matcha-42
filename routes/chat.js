var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	router = express.Router()

router.get('/:id', function(req, res, next) {
	if (req.session && req.session.login) {
		if (req.params.id) {
			var talkto = req.params.id
			connect.query("SELECT * FROM message WHERE (login = ? AND user = ?) OR (login = ? AND user = ?) ORDER BY sendat ASC", [talkto, req.session.login, req.session.login, talkto], (err, rows, result) => {
				if (err) console.log(err)
				var message = rows
				console.log(message)
				res.render('chat', { title: 'Express', talkto: talkto, message: message })
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
