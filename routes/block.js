var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	router = express.Router()


router.get('/:id', function(req, res, next) {
	if (req.session && req.session.login) {
		if (req.params.id) {
		connect.query("INSERT INTO blocked SET login = ?, user = ?", [req.session.login, req.params.id], (err) => {
			if (err) console.log(err)
			connect.query("DELETE FROM message WHERE user = ? AND login = ?", [req.session.user, req.params.id], (err) => {
			 if (err) console.log(err)
			 connect.query("DELETE FROM message WHERE user = ? AND login = ?", [req.params.id, req.session.user], (err) => {
			  if (err) console.log(err)
			  connect.query("DELETE FROM liked WHERE user = ? AND login = ?", [req.params.id, req.session.user], (err) => {
			   if (err) console.log(err)
			   connect.query("DELETE FROM liked WHERE user = ? AND login = ?", [req.session.user, req.params.id], (err) => {
			    if (err) console.log(err)
				connect.query("DELETE FROM matched WHERE user = ? AND login = ?", [req.session.user, req.params.id], (err) => {
				 if (err) console.log(err)
				 connect.query("DELETE FROM matched WHERE user = ? AND login = ?", [req.params.id, req.session.user], (err) => {
				  if (err) console.log(err)
				  connect.query("DELETE FROM notif WHERE user = ? AND login = ?", [req.params.id, req.session.user], (err) => {
				   if (err) console.log(err)
				   connect.query("DELETE FROM notif WHERE user = ? AND login = ?", [req.session.user, req.params.id], (err) => {
				    if (err) console.log(err)
					req.session.error = req.params.id + ' a ete block'
					res.redirect('/user/' + req.params.id)
				   })
				  })
			     })
				})
			   })
			  })
			 })
			})
		   })
		} else {
			req.session.error = 'Un erreur est survenue'
			res.redirect('/profil/' + req.params.id)
		}
	} else {
		req.session.error = 'Vous devez vous connecter pour acceder a cette page.'
		res.redirect('/')
	}
})

module.exports = router
