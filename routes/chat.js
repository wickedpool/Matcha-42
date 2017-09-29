var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	router = express.Router()

router.get('/:id', function(req, res, next) {
	if (req.session && req.session.login) {
		if (req.params.id) {
			var talkto = req.params.id
			res.render('chat', { title: 'Express', talkto: talkto })
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
