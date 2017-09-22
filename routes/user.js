var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	router = express.Router()

router.get('/:id', function(req, res, next) {
	if (req.session && req.session.login) {
		var login = req.params.id
		if (login) {
			connect.query("SELECT * from user WHERE login = ?", [login], (err, rows, result) => {
				if (err) console.log(err)
				if (rows) {
					connect.query("SELECT * from tag WHERE login = ?", [login], (err1, rows1, result1) => {
						if (err1) console.log(err1)
						var UserTag = rows1
						var name = rows[0].name,
							lastname = rows[0].lastname,
							sexe = rows[0].sexe,
							interest = rows[0].interest,
							age = rows[0].age,
							mainpic = rows[0].mainpic,
							descri = rows[0].description
						req.session.login2 = req.params.id
						connect.query("SELECT * FROM liked WHERE login = ? AND liked = ?", [req.session.login, login], (err2, rows2, result2) => {
							if (err) console.log(err)
							if (rows2[0] != undefined) {
								res.locals.liked = "ok"
							} else {
								res.locals.liked = undefined
							}
							res.render('user', { title: 'Express', UserTag: UserTag, age: age, login2: login, name: name, lastname: lastname, sexe: sexe, interest: interest, mainpic: mainpic, descri: descri, mine: req.session.login })
						})
					})
				} else {
					req.session.error = 'L\'utilisateur n\'existe pas'
					res.redirect('/profil')
				}
			})
		}
	} else {
		req.session.error = 'Vous devez vous connecter pour acceder a cette page'
		res.redirect('/')
	}
})

router.post('/like', function(req, res, next) {
	if (req.session && req.session.login) {
		if (req.session.ok) {
			connect.query("INSERT INTO liked set liked = ?, login = ?", [req.session.login2, req.session.login], (err) => {
				if (err) console.log(err)
				connect.query("UPDATE popularity SET famous = famous + 5 WHERE login = ?", [req.session.login], (err) => {
					if (err) console.log(err)
					req.session.success = 'Vous avez like ' + req.session.login2
					res.redirect('/user/'+ req.session.login2)
				})
			})
		} else {
			req.session.error = 'Vous devez completer votre profil pour faire quoi que ce soit d\'autre'
			res.redirect('/profil')
		}
	} else {
		req.session.error = 'Vous devez vous connecter pour acceder a cette page'
		res.redirect('/')
	}
})

router.post('/unlike', function(req, res, next) {
	if (req.session && req.session.login) {
		if (req.session.ok) {
			console.log(req.session.login2)
			console.log(req.session.login)
			connect.query('DELETE FROM liked WHERE liked = ? AND login = ?', [req.session.login2, req.session.login], (err) => {
				if (err) console.log(err)
				connect.query("UPDATE popularity SET famous = famous - 5 WHERE login = ?", [req.session.login], (err) => {
					if (err) console.log(err)
					res.locals.liked = undefined
					req.session.success = 'Vous avez unlike ' + req.session.login2
					res.redirect('/user/'+ req.session.login2)
				})
			})
		} else {
			req.session.error = 'Vous devez completer votre profil pour faire quoi que ce soit d\'autre'
			res.redirect('/profil')
		}
	} else {
		req.session.error = 'Vous devez vous connecter pour acceder a cette page'
		res.redirect('/')
	}
})


module.exports = router
