var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	router = express.Router()

router.get('/', function(req, res, next) {
	if (req.session && req.session.login) {
		connect.query("SELECT tag FROM tag WHERE login = ?", [req.session.login], (err, rows, result) => {
			if (err) console.log(err)
			res.locals.tag = rows
		res.render('user_edit', { title: 'Express' })
	})
	} else {
		req.session.error = 'Vous devez vous connecter pour acceder a cette page.'
		res.redirect('/')
	}
})

router.post('/', function(req, res, next) {
	if (req.session && req.session.login) {
		var tag = req.body.tag	
		if (tag) {
			if (tag.length > 15) {
				req.session.error = 'Le tag est trop long'
				res.redirect('/user_edit')
			} else {
					connect.query("INSERT INTO tag SET login = ?, tag = ?", [req.session.login, tag], (err) => {
					if (err) console.log(err)
					req.session.success = 'Votre tag a bien ete ajoute'	
					req.session.info = 'Vous pouvez en ajouter autant que vous voulez'
					res.redirect('/user_edit')
				})
			} 	
		} else {
			req.session.error = 'Le champ est vide'
			res.redirect('/user_edit')
		}
	} else {
		req.session.error = 'Vous devez vous connecter pour acceder a cette page.'
		res.redirect('/')
	}
})

router.get('/:tag', function(req, res) {
	if (req.session && req.session.login) {
		console.log("==============================")
		var tag = req.params.tag
		console.log(tag)
		console.log("==============================")
		res.render('user_edit', { title: 'Express' })
	} else {
		req.session.error = 'Vous devez vous connecter pour acceder a cette page.'
		res.redirect('/')
	}
})

module.exports = router
