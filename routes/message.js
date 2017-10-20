var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	router = express.Router()

router.get('/', function(req, res, next) {
	if (req.session && req.session.login) {
		connect.query("SELECT * FROM matched WHERE login = ? LIMIT 1", [req.session.login], (err, rows, result) => {
			if (err) console.log(err)
			if (rows[0] != undefined) {
				connect.query("SELECT m.matched, u.mainpic FROM matched m INNER JOIN user u ON m.matched = u.login WHERE m.login = ?", [req.session.login], (err1, rows1, result1) => {
					if (err) console.log(err)
					var matched = rows1
 					res.render('message', { title: 'Express', matched: matched })
				})
			} else {
				req.session.error = 'Personne n\'a match avec vous pour l\'instant!'
				res.redirect('/home')
			}
		})
	} else {
		req.session.error = 'Vous devez vous connecter pour acceder a cette page'
		res.redirect('/')
	}
})


router.get('/:id', function(req, res, next) {
	if (req.session && req.session.login) {
		connect.query("SELECT * FROM matched WHERE login = ? AND matched = ?", [req.session.login, req.params.id], (err, rows, result) => {
			if (err) console.log(err)
			if (rows[0] != undefined) {
				req.session.success = 'coucou'
				res.redirect('/message')
			} else {
				req.session.error = 'Personne n\'a match avec vous pour l\'instant!'
				res.redirect('/user/' + req.params.id)
			}
		})
	} else {
		req.session.error = 'Vous devez vous connecter pour acceder a cette page'
		res.redirect('/')
	}
})

router.get('/msg/:id', function(req, res, next) {
	if (req.session && req.session.login) {
		if (req.params.id) {
			var talkto = req.params.id
			res.render('chat', { title: 'Express' })
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
