var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	router = express.Router()

router.get('/', function(req, res, next) {
	if (req.session && req.session.login) {
		var skip = "non"
		var skip1 = "non"
		var skip2 = "non"
		var profile = undefined
		res.render('search', { profile: profile, skip: skip, skip1: skip1, skip2: skip2 })
	} else {
		req.session.error = 'Vous devez vous connecter'
		res.redirect('/')
	}
})

router.get('/tag', function(req, res, next) {
	if (req.session && req.session.login) {
		var tag = req.query.tag
		if (tag) {
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
				if (tag.length > 15) {
					req.session.error = 'tag trop long'
					res.redirect('/search')
				} else if (tag.length < 3) {
					req.session.error = 'tag trop court'
					res.redirect('/search')
				} else {
					connect.query("SELECT u.login, u.name, u.lastname, u.sexe, u.age, u.interest, u.description, u.mainpic FROM user u INNER JOIN tag t ON t.login = u.login WHERE t.tag = ? AND u.login != ? AND u.mainpic IS NOT NULL AND u.sexe = ? AND (INTEREST = ? OR INTEREST = ?)", [tag, req.session.login, req.session.interest, req.session.sexe, "both"], (err, rows, result) => {
						if (err) console.log(err)
						if (rows != undefined) {
							var profile = rows
							res.render('search', { title: 'Express', profile: profile, skip: skip, skip1: skip1, skip2: skip2 })
						} else {
							req.session.info = 'personne ne correspond a ce tag'
							res.redirect('/search')
						}
					})
				}
			})
		} else {
			req.session.error = 'Mauvais tag'
			res.redirect('/search')
		}
	} else {
		req.session.error = 'Vous devez vous connecter'
		res.redirect('/')
	}
})

router.get('/city', function(req, res, next) {
	if (req.session && req.session.login) {
		var city = req.query.city
		if (city) {
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
				if (city.length > 15) {
					req.session.error = 'tag trop long'
					res.redirect('/search')
				} else if (city.length < 3) {
					req.session.error = 'tag trop court'
					res.redirect('/search')
				} else {
					connect.query("SELECT login, name, lastname, sexe, age, interest, description, mainpic FROM user WHERE city = ? AND login != ? AND mainpic IS NOT NULL AND sexe = ? AND (INTEREST = ? OR INTEREST = ?)", [city, req.session.login, req.session.interest, req.session.sexe, "both"], (err, rows, result) => {
						if (err) console.log(err)
						if (rows != undefined) {
							var profile = rows
							res.render('search', { title: 'Express', profile: profile, skip: skip, skip1: skip1, skip2: skip2 })
						} else {
							req.session.info = 'personne ne correspond a cette ville'
							res.redirect('/search')
						}
					})
				}
			})
		} else {
			req.session.error = 'Mauvais tag'
			res.redirect('/search')
		}
	} else {
		req.session.error = 'Vous devez vous connecter'
		res.redirect('/')
	}
})


router.get('/age', function(req, res, next) {
	if (req.session && req.session.login) {
		var max = req.query.max
		var min = req.query.min
		if (max && min) {
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
				if (min < 18) {
					req.session.error = 'Trop petit'
					res.redirect('/search')
				} else if (max >= 55) {
					req.session.error = "Trop grand"
					res.redirect('/search')
				} else if (min > max) {
					req.session.error = "Minimum superieur au Maximum"
					res.redirect('/search')
				} else {
					connect.query("SELECT login, name, lastname, sexe, age, interest, description, mainpic FROM user WHERE city = ? AND login != ? AND mainpic IS NOT NULL AND sexe = ? AND (INTEREST = ? OR INTEREST = ?) AND age BETWEEN ? AND ?", [req.session.city, req.session.login, req.session.interest, req.session.sexe, "both", min, max], (err, rows, result) => {
						if (err) console.log(err)
						if (rows != undefined) {
							var profile = rows
							res.render('search', { title: 'Express', profile: profile, skip: skip, skip1: skip1, skip2: skip2 })
						} else {
							req.session.info = 'personne ne correspond a ce tag'
							res.redirect('/search')
						}
					})	
				}
			})
		} else {
			req.session.error = 'Mauvaise tranche d\'age'
			res.redirect('/search')
		}
	} else {
		req.session.error = 'Vous devez vous connecter'
		res.redirect('/')
	}
})

router.get('/famous', function(req, res, next) {
	if (req.session && req.session.login) {
		var max = req.query.fmax
		var min = req.query.fmin
		if (max && min) {
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
				if (min < 10) {
					req.session.error = 'Trop petit'
					res.redirect('/search')
				} else if (max >= 1000) {
					req.session.error = "Trop grand"
					res.redirect('/search')
				} else if (min > max) {
					req.session.error = "Minimum superieur au Maximum"
					res.redirect('/search')
				} else {
			connect.query("SELECT u.login, u.name, u.lastname, u.sexe, u.age, u.interest, u.description, u.mainpic FROM user u INNER JOIN popularity p ON u.login = p.login WHERE u.city = ? AND u.login != ? AND u.mainpic IS NOT NULL AND sexe = ? AND (INTEREST = ? OR INTEREST = ?) AND p.famous BETWEEN ? AND ?", [req.session.city, req.session.login, req.session.interest, req.session.sexe, "both", min, max], (err, rows, result) => {
						if (err) console.log(err)
						if (rows != undefined) {
							var profile = rows
							res.render('search', { title: 'Express', profile: profile, skip: skip, skip1: skip1, skip2: skip2 })
						} else {
							req.session.info = 'personne ne correspond a ce tag'
							res.redirect('/search')
						}
					})	
				}
			})
		} else {
			req.session.error = 'Mauvaise tranche d\'age'
			res.redirect('/search')
		}
	} else {
		req.session.error = 'Vous devez vous connecter'
		res.redirect('/')
	}
})

module.exports = router
