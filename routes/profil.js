var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	router = express.Router()

router.get('/', function(req, res, next) {
	res.render('profil', { title: 'Express' })
})

module.exports = router
