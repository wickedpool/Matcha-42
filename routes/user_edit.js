var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	bodyP = require('body-parser'),
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

router.post('/des', function(req, res, next) {
	RegexMore = /[a-zA-Z\,\.]/
	if (req.session && req.session.login) {
		var descri = req.body.descri
		if (descri) {
			if (descri.length < 10) {
				req.session.error = 'Le champ rempli est trop court'
				res.redirect('/user_edit')
			} else if (descri.length > 200) {
				req.session.error = 'Le champ rempli est trop long (200chars)'
				res.redirect('/user_edit')
			} else if (descri.search(RegexMore) == -1) {
				req.session.error = 'La description ne peux pas contenir de caracteres spéciaux mise a part une virgule " , " et un point " . "'
				res.redirect('/user_edit')
			} else {
				connect.query("UPDATE user SET description = ? WHERE login = ?", [descri, req.session.login], (err) => {
					if (err) console.log(err)
					req.session.success = 'Votre description a ete mise a jour'
					res.redirect('/user_edit')
				})
			}
		} else {
			
			req.session.error = 'Le champ est vide'
			res.redirect('/user_edit')
		}
	}
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
