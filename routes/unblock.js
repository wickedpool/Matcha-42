var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	router = express.Router()

router.get('/:id', function(req, res, next) {
	if (req.session && req.session.login) {
		if (req.params.id) {
			if (req.session.login != req.params.id) {
				connect.query("DELETE FROM blocked WHERE user = ? AND login = ?", [req.params.id, req.session.login], (err) => {
					if (err) console.log(err)
					req.session.success = req.params.id + " n\'est plus block"
					res.redirect('/home')
				})
			} else {
				req.session.error = 'Une erreur est survenue'
				res.redirect('/home')
			}
		} else {
			req.session.error = 'Un erreur est survenue'
			res.redirect('/home')
		}
	} else {
		req.session.error = 'Vous devez vous connecter pour acceder a cette page.'
		res.redirect('/')
	}
})

module.exports = router
