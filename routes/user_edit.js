var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	router = express.Router()

router.get('/', function(req, res, next) {
	res.render('user_edit', { title: 'Express' })
})

router.post('/', function(req, res, next) {
	var tag = req.body.tag	
	if (tag) {
		String arr[] = tag.split(" ", 2),
			first = arr[0]
		if (arr[0] == tag) {
			if (tag.length > 15) {
				req.session.error = 'Le tag est trop long'
				res.redirect('/user_edit')
			} else {
				req.session.success = 'Tes au klm groos !'
				res.redirect('/user_edit')
			}
		} else {
			req.session.error = 'Le hobbie doit etre un mot et ne doit pas contenir d\'espaces'
			res.redirect('/user_edit')
		} else {
			req.session.error = 'Le champ est vide'
			res.redirect('/user_edit')
		}
	}
})

module.exports = router
