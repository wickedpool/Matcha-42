var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	ageCalculator = require('age-calculator'),
	router = express.Router()

let {AgeFromDateString, AgeFromDate} = require('age-calculator')

router.get('/:id', function(req, res, next) {
	if (req.session && req.session.login) {
		var login = req.params.id
		if (login) {
			connect.query("SELECT * from user WHERE login = ?", [login], (err, rows, result) => {
				if (err) console.log(err)
				if (rows) {
					connect.query("SELECT * from tag WHERE login = ?", [login], (err1, rows1, result1) => {
						if (err1) console.log(err1)
						let ageFromString = new AgeFromDateString(rows[0].age).age
						var UserTag = rows1
						var name = rows[0].name,
							lastname = rows[0].lastname,
							sexe = rows[0].sexe,
							interest = rows[0].interest,
							age = ageFromString
							mainpic = rows[0].mainpic,
							descri = rows[0].description
						res.render('user', { title: 'Express', UserTag: UserTag, age: age, login2: login, name: name, lastname: lastname, sexe: sexe, interest: interest, mainpic: mainpic, descri: descri, mine: req.session.login })
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


module.exports = router
