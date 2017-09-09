var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	router = express.Router()

router.get('/', function(req, res, next) {
	connect.query("SELECT tag FROM tag WHERE login = ?", [req.session.login], (err, rows, result) => {
		if (err) console.log(err)
		for (var i = 0; i < rows.length; i++) {
			req.session.i = rows[i].tag
		}
		req.session.count = i;
	})
	res.render('user_edit', { title: 'Express' })
})

router.post('/', function(req, res, next) {
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
})

module.exports = router
