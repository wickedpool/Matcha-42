var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	router = express.Router()

router.get('/:id', function(req, res, next) {
	if (req.session && req.session.login) {
		if (req.params.id) {
			connect.query("SELECT * from fake WHERE login = ?", [req.params.id], (err, rows, result) => {
				if (err) console.log(err)
				if (rows[0] == undefined) {
					connect.query("INSERT INTO fake SET login = ?, report = ?", [req.params.id, 1], (err) => {
						if (err) console.log(err)
						req.session.success = req.params.id + ' a ete report as fake thank you!'
						res.redirect('/home')
					})
				} else if (rows[0].report >= 10) {
					connect.query("DELETE FROM user WHERE login = ?", [req.params.login], (err) => {
						if (err) console.log(err)
						req.session.success = req.params.id + ' a ete report as fake thank you!'
						res.redirect('/home')
					})
				} else {
					connect.query("UPDATE fake SET report = report + 1 WHERE login = ?", [req.params.id], (err) => {
						if (err) console.log(err)
						req.session.success = req.params.id + ' a ete report as fake thank you!'
						res.redirect('/home')
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
