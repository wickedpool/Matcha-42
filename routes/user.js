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
							mainpic1 = rows[0].mainpic,
							descri = rows[0].description
						req.session.login2 = req.params.id
						connect.query("SELECT * FROM liked WHERE login = ? AND liked = ?", [req.session.login, login], (err2, rows2, result2) => {
							if (err) console.log(err)
							if (rows2[0] != undefined) {
								res.locals.liked = "ok"
								connect.query("SELECT * FROM liked WHERE login = ? AND liked = ?", [login, req.session.login], (err3, rows3, res3) => {
									if (err) console.log(err)
									if (rows3[0] != undefined) {
										req.session.chat = "ok"
									}
								})
							} else {
								res.locals.liked = undefined
							}
							res.render('user', { title: 'Express', UserTag: UserTag, age: age, login2: login, name: name, lastname: lastname, sexe: sexe, interest: interest, mainpic1: mainpic1, descri: descri, mine: req.session.login })
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
				var notiflike = req.session.login + 'Vous a like'
				connect.query("INSERT INTO notif SET login = ?, sendat = ?, type = ?, msg = ?", [req.session.login2, new Date(), "like", notiflike], (err) => {
					if (err) console.log(err)
				connect.query("UPDATE popularity SET famous = famous + 5 WHERE login = ?", [req.session.login], (err) => {
					if (err) console.log(err)
					connect.query("SELECT * FROM liked WHERE login = ? AND liked = ?", [req.session.login2, req.session.login], (err3, rows3, res3) => {
						if (err) console.log(err)
						if (rows3[0] != undefined) {
							connect.query("INSERT INTO matched SET login = ?, matched = ?", [req.session.login, req.session.login2], (err) => {
								if (err) console.log(err)
								connect.query("INSERT INTO matched SET login = ?, matched = ?", [req.session.login2, req.session.login], (err) => {
									if (err) console.log(err)
									connect.query("UPDATE popularity SET famous = famous + 15 WHERE login = ?", [req.session.login], (err) => {
										if (err) console.log(err)
									var notifmatch = 'Vous avez match avec ' + req.session.login2
									var notif2match = 'Vous avez match avec ' + req.session.login2
									connect.query("INSERT INTO notif SET login = ?, sendat = ?, type = ?, msg = ?", [req.session.login, new Date(), "match", notifmatch], (err) => {
										if (err) console.log(err)
									connect.query("INSERT INTO notif SET login = ?, sendat = ?, type = ?, msg = ?", [req.session.login2, new Date(), "match", notif2match], (err) => {
										if (err) console.log(err)
										req.session.success = 'Vous avez like ' + req.session.login2
										req.session.success = 'Vous avez match avec ' + req.session.login2
										req.session.info = 'Vous pouvez maintenant parler avec ' + req.session.login2
										req.session.chat = "ok"
										res.redirect('/user/'+ req.session.login2)
									})
									})
								})
							})
							})
						} else {
								req.session.success = 'Vous avez like ' + req.session.login2
								res.redirect('/user/'+ req.session.login2)
						}
					})
				})
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
			connect.query('DELETE FROM liked WHERE liked = ? AND login = ?', [req.session.login2, req.session.login], (err) => {
				if (err) console.log(err)
				var notifunlike = req.session.login + ' vous a unlike'
			connect.query("INSERT INTO notif SET login = ?, sendat = ?, type = ?, msg = ?", [req.session.login2, new Date(), "unlike", notifunlike], (err) => {
				if (err) console.log(err)
				connect.query("UPDATE popularity SET famous = famous - 5 WHERE login = ?", [req.session.login], (err) => {
					if (err) console.log(err)
					res.locals.liked = undefined
					connect.query("SELECT * FROM matched WHERE login = ? AND matched = ?", [req.session.login, req.session.login2], (err, rows, result) => {
						if (err) console.log(err)
						if (rows[0] != undefined) {
							connect.query("DELETE FROM matched WHERE login = ? AND matched = ?", [req.session.login, req.session.login2], (err) => {
								if (err) console.log(err)
								connect.query("DELETE FROM matched WHERE login = ? AND matched = ?", [req.session.login2, req.session.login], (err) => {
									if (err) console.log(err)
									req.session.success = 'Vous avez unlike ' + req.session.login2
									req.session.success = 'Vous avez unmatch ' + req.session.login2
									res.redirect('/user/'+ req.session.login2)
								})
							})
						} else {
							req.session.success = 'Vous avez unlike ' + req.session.login2
							res.redirect('/user/'+ req.session.login2)
						}
					})
				})
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
