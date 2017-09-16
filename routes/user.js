var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	router = express.Router()

router.get('/:id', function(req, res, next) {
	if (req.session && req.session.login) {
		res.render('user', { title: 'Express' })
	} else {
		req.session.error = 'Vous devez vous connecter pour acceder a cette page'
		res.redirect('/profil')
	}
})

module.exports = router
