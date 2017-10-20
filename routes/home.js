var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	router = express.Router()

router.get('/', function(req, res, next) {
	if (req.session && req.session.login) {
		if (req.session.ok) {
			connect.query("SELECT login FROM blocked WHERE user = ?", [req.session.login], (err, rows0, result) => {
				if (err) console.log(err)
				if (rows0[0] != undefined) {
					var skip = rows0[0].login
					if (rows0[1] != undefined)
						var skip1 = rows0[1].login
					else
						var skip1 = "non"
					if (rows0[2] != undefined)
						var skip2 = rows0[2].login
					else
						var skip2 = "non"
				} else {
					var skip = "non"
					var skip1 = "non"
					var skip2 = "non"
				}
			var login = req.session.login,
				sexe = req.session.sexe,
				age = req.session.age,
				interest = req.session.interest,
				descri = req.session.descri
				city = req.session.city
			connect.query("SELECT * from user WHERE login != ?", [login], (error, colums, resultat) => {
			if (error) console.log(error)
				if (colums.length != 0) {
					if (interest == "female" && sexe == "male") {
						connect.query("SELECT login, name, lastname, sexe, age, interest, description, mainpic FROM user WHERE sexe = ? AND city = ? AND login != ? AND mainpic IS NOT NULL AND (interest = ? OR interest = ?)", ["female", city, login, "male", "both"], (err, rows, result) => {
							if (err) console.log(err)
							var profile = rows
							res.render('home', { title: 'Express', profile: profile, skip: skip, skip1: skip1, skip2: skip2})
						})
					} else if (interest == "male" && sexe == "female") {
						connect.query("SELECT login, name, lastname, sexe, age, interest, description, mainpic FROM user WHERE sexe = ? AND city = ? AND login != ? AND mainpic IS NOT NULL AND (interest = ? OR interest = ?)", ["male", city, login, "female", "both"], (err, rows, result) => {
							if (err) console.log(err)
							var profile = rows
							res.render('home', { title: 'Express', profile: profile, skip: skip, skip1: skip1, skip2: skip2})
						})

					} else if (interest == "both" && sexe == "male") {
						connect.query("SELECT login, name, lastname, sexe, age, interest, description, mainpic FROM user WHERE (sexe = ? OR sexe = ?) AND city = ? AND login != ? AND mainpic IS NOT NULL AND interest = ?", ["male", "female", city, login, "male"], (err, rows, result) => {
							if (err) console.log(err)
							var profile = rows
							res.render('home', { title: 'Express', profile: profile, skip: skip, skip1: skip1, skip2: skip2})
						})

					} else if (interest == "both" && sexe == "female") {
						connect.query("SELECT login, name, lastname, sexe, age, interest, description, mainpic FROM user WHERE city = ? AND login != ? AND mainpic IS NOT NULL AND interest = ?", [city, login, "female"], (err, rows, result) => {
							if (err) console.log(err)
							var profile = rows
							res.render('home', { title: 'Express', profile: profile, skip: skip, skip1: skip1, skip2: skip2})
						})
					} else {
						connect.query("SELECT login, name, lastname, sexe, age, interest, description, mainpic FROM user WHERE city = ? AND login != ? AND mainpic IS NOT NULL", [city, login], (err, rows, result) => {
							if (err) console.log(err)
							var profile = rows
							res.render('home', { title: 'Express', profile: profile, skip: skip, skip1: skip1, skip2: skip2})
						})

					}
				} else {
					var profile = undefined
					res.render('home', { title: 'Express', profile: profile})
				}
			})
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
		let arr = []
		connect.query("SELECT tag FROM tag WHERE login = ?", [req.session.login], (err, rows, result) => {
			if (err) console.log(err)
			if (rows[0] != undefined) {
				var i = 0;
				var k = 0;
				while (rows[i]) {
					connect.query("SELECT login from tag WHERE login != ? AND tag = ?", [req.session.login, rows[i].tag], (err1, rows1, result1) => {
						if (err) console.log(err)
						if (rows1.length != 0) {
							for (var j=0;rows1[j];j++) {
								arr[k] = rows1[j].login
								k++;
							}
						}
					})
					i++
				}
			}
			res.redirect('/home')
		})
	} else {
		req.session.error = 'Vous devez vous connecter'
		res.redirect('/')
	}
})

router.get('/famous', function(req, res, next) {
	if (req.session && req.session.login) {
		connect.query("SELECT login FROM blocked WHERE user = ?", [req.session.login], (err, rows0, result) => {
			if (err) console.log(err)
			if (rows0[0] != undefined) {
				var skip = rows0[0].login
				if (rows0[1] != undefined)
					var skip1 = rows0[1].login
				else
					var skip1 = "non"
				if (rows0[2] != undefined)
					var skip2 = rows0[2].login
				else
					var skip2 = "non"
			} else {
				var skip = "non"
				var skip1 = "non"
				var skip2 = "non"
			}
			connect.query("SELECT u.login, u.name, u.lastname, u.sexe, u.age, u.interest, u.description, u.mainpic FROM user u INNER JOIN popularity p ON u.login = p.login WHERE u.city = ? AND u.login != ? AND u.mainpic IS NOT NULL AND sexe = ? AND (INTEREST = ? OR INTEREST = ?) ORDER BY p.famous DESC", [req.session.city, req.session.login, req.session.interest, req.session.sexe, "both"], (err, rows, result) => {
				if (rows[0] != undefined) {
					var profile = rows
					res.render('home', { title: 'Express', profile: profile, skip: skip, skip1: skip1, skip2: skip2 })
				} else {
					var profile = undefined
					res.redirect('/home')
				}
			})
		})
	} else {
		req.session.error = 'Vous devez vous connecter'
		res.redirect('/')
	}
})


router.get('/age', function(req, res, next) {
	if (req.session && req.session.login) {
		connect.query("SELECT login FROM blocked WHERE user = ?", [req.session.login], (err, rows0, result) => {
			if (err) console.log(err)
			if (rows0[0] != undefined) {
				var skip = rows0[0].login
				if (rows0[1] != undefined)
					var skip1 = rows0[1].login
				else
					var skip1 = "non"
				if (rows0[2] != undefined)
					var skip2 = rows0[2].login
				else
					var skip2 = "non"
			} else {
				var skip = "non"
				var skip1 = "non"
				var skip2 = "non"
			}
			connect.query("SELECT login, name, lastname, sexe, age, interest, description, mainpic FROM user WHERE city = ? AND login != ? AND mainpic IS NOT NULL AND sexe = ? AND (INTEREST = ? OR INTEREST = ?) ORDER BY age DESC", [req.session.city, req.session.login, req.session.interest, req.session.sexe, "both"], (err, rows, result) => {
				if (rows[0] != undefined) {
					var profile = rows
					res.render('home', { title: 'Express', profile: profile, skip: skip, skip1: skip1, skip2: skip2 })
				} else {
					var profile = undefined
					res.redirect('/home')
				}
			})
		})
	} else {
		req.session.error = 'Vous devez vous connecter'
		res.redirect('/')
	}
})

module.exports = router
