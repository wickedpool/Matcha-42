var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	router = express.Router()

router.get('/', function(req, res, next) {
	if (req.session && req.session.login) {
		connect.query("SELECT * FROM user WHERE login = ?", [req.session.login], (err, rows, result) => {
			if (err) console.log(err)
			connect.query("SELECT * FROM tag WHERE login = ? LIMIT 1", [req.session.login], (err1, rows1, result1) => {
				if (err1) console.log(err1)
				if (rows[0].description && rows[0].mainpic && rows1[0].tag) {
					req.session.ok = true
				}
			})
		})
		connect.query("SELECT tag FROM tag WHERE login = ?", [req.session.login], (err, rows, result) => {
			if (err) console.log(err)
			res.locals.tag = rows
			connect.query("SELECT description FROM user WHERE login = ?", [req.session.login], (err, rows, result) => {
				if (err) console.log(err)
				res.render('profil', { descri: rows[0].description})
			})
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
				res.redirect('/profil')
			} else {
					connect.query("INSERT INTO tag SET login = ?, tag = ?", [req.session.login, tag], (err) => {
					if (err) console.log(err)
					req.session.success = 'Votre tag a bien ete ajoute'	
					req.session.info = 'Vous pouvez en ajouter autant que vous voulez'
					res.redirect('/profil')
				})
			} 	
		} else {
			req.session.error = 'Le champ est vide'
			res.redirect('/profil')
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
				res.redirect('/profil')
			} else if (descri.length > 200) {
				req.session.error = 'Le champ rempli est trop long (200chars)'
				res.redirect('/profil')
			} else if (descri.search(RegexMore) == -1) {
				req.session.error = 'La description ne peux pas contenir de caracteres spéciaux mise a part une virgule " , " et un point " . "'
				res.redirect('/profil')
			} else {
				connect.query("UPDATE user SET description = ? WHERE login = ?", [descri, req.session.login], (err) => {
					if (err) console.log(err)
					res.locals.descri = descri
					req.session.success = 'Votre description a ete mise a jour'
					res.redirect('/profil')
				})
			}
		} else {
			req.session.error = 'Le champ est vide'
			res.redirect('/profil')
		}
	} else {
		req.session.error = 'Vous devez vous connecter pour acceder a cette page.'
		res.redirect('/')
	}
})


module.exports = router
