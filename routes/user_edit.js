var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	bodyP = require('body-parser'),
	router = express.Router()

router.get('/', function(req, res, next) {
	res.render('/profil', { title: 'Express' })
})


router.get('/tag/:tag', function(req, res) {
	if (req.session && req.session.login) {
		var tag = req.params.tag
		if (tag) {
			connect.query("SELECT tag from tag WHERE login = ? AND tag = ?", [req.session.login, tag], (err, rows, result) => {
				if (err) console.log(err)
				if (rows[0].tag) {
					connect.query("DELETE from tag WHERE tag = ? AND login = ?", [tag, req.session.login], (err) => {
						if (err) console.log(err)
						req.session.success = 'Votre tag a bien ete supprime'
						res.redirect('/profil')
					})
				}
			})
		}
	} else {
		req.session.error = 'Vous devez vous connecter pour acceder a cette page.'
		res.redirect('/')
	}
})

module.exports = router
