var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	router = express.Router()

router.get('/', function(req, res, next) {
	if (req.session && req.session.login) {
		if (req.session.ok) {
			var login = req.session.login,
				sexe = req.session.sexe,
				age = req.session.age,
				interest = req.session.interest,
				descri = req.session.descri
				city = req.session.city
			connect.query("SELECT * from user WHERE sexe = ? AND login != ?", [interest, login], (error, colums, resultat) => {
			if (error) console.log(error)
				console.log(colums.length)
				if (colums.length != 0) {
					if (interest == "female" && sexe == "male") {
						connect.query("SELECT login, name, lastname, sexe, age, interest, description, mainpic FROM user WHERE sexe = ? AND city = ? AND login != ? AND mainpic IS NOT NULL AND (interest = ? OR interest = ?)", ["female", city, login, "male", "both"], (err, rows, result) => {
							if (err) console.log(err)
							var profile = rows
							res.render('home', { title: 'Express', profile: profile })
						})
					} else if (interest == "male" && sexe == "female") {
						connect.query("SELECT login, name, lastname, sexe, age, interest, description, mainpic FROM user WHERE sexe = ? AND city = ? AND login != ? AND mainpic IS NOT NULL AND (interest = ? OR interest = ?)", ["male", city, login, "female", "both"], (err, rows, result) => {
							if (err) console.log(err)
							var profile = rows
							res.render('home', { title: 'Express', profile: profile })
						})

					} else if (interest == "both" && sexe == "male") {
						connect.query("SELECT login, name, lastname, sexe, age, interest, description, mainpic FROM user WHERE sexe = ? AND city = ? AND login != ? AND mainpic IS NOT NULL AND interest = ?", ["male", city, login, "female"], (err, rows, result) => {
							if (err) console.log(err)
							var profile = rows
							res.render('home', { title: 'Express', profile: profile })
						})

					} else if (interest == "both" && sexe == "female") {
						connect.query("SELECT login, name, lastname, sexe, age, interest, description, mainpic FROM user WHERE city = ? AND login != ? AND mainpic IS NOT NULL AND interest = ?", [city, login, "female"], (err, rows, result) => {
							if (err) console.log(err)
							var profile = rows
							res.render('home', { title: 'Express', profile: profile })
						})
					} else {
						connect.query("SELECT login, name, lastname, sexe, age, interest, description, mainpic FROM user WHERE city = ? AND login != ? AND mainpic IS NOT NULL", [city, login], (err, rows, result) => {
							if (err) console.log(err)
							var profile = rows
							res.render('home', { title: 'Express', profile: profile })
						})

					}
				} else {
					console.log('============')
					var profile = undefined
					res.render('home', { title: 'Express', profile: profile})
				}
			})
		} else {
			req.session.error = 'Vous devez completer votre profil pour aller sur cette page.'
			res.redirect('/profil')
		}
	} else {
		req.session.error = 'Vous devez vous connecter'
		res.redirect('/')
	}
})

router.get('/tag', function(req, res, next) {
	if (req.session && req.session.login) {
		connect.query("SELECT tag FROM tag WHERE login = ?", [req.session.login], (err, rows, result) => {
			if (err) console.log(err)
			if (rows[0] != undefined) {
				var i = 0;
				var arr = []
				while (rows[i]) {
					connect.query("SELECT login from tag WHERE login != ? AND tag = ?", [req.session.login, rows[i].tag], (err1, rows1, result1) => {
						if (err) console.log(err)
						console.log('////////////////////////')
						console.log(rows1)
						if (rows1.length != 0) {
							console.log(rows1)
							console.log('==============')
							arr.push(rows1)
							console.log('==============')
							console.log(arr)
						}
					})
					i++
				}
			}
			console.log(rows)
			res.redirect('/home')
		})
	} else {
		req.session.error = 'Vous devez vous connecter'
		res.redirect('/')
	}
})

router.get('/famous', function(req, res, next) {
	if (req.session && req.session.login) {
		connect.query("SELECT u.login, u.name, u.lastname, u.sexe, u.age, u.interest, u.description, u.mainpic FROM user u INNER JOIN popularity p ON u.login = p.login WHERE u.city = ? AND u.login != ? AND u.mainpic IS NOT NULL AND sexe = ? AND (INTEREST = ? OR INTEREST = ?) ORDER BY p.famous DESC", [req.session.city, req.session.login, req.session.interest, req.session.sexe, "both"], (err, rows, result) => {
			console.log(rows[0])
			if (rows != undefined) {
				var profile = rows
				res.render('home', { title: 'Express', profile: profile })
			} else {
				var profile = undefined
				res.redirect('/home')
			}
		})
	} else {
		req.session.error = 'Vous devez vous connecter'
		res.redirect('/')
	}
})

module.exports = router
