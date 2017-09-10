var express = require('express'),
	connect = require('../config/database.js'),
	session = require('express-session'),
	router = express.Router()

router.get('/', function(req, res, next) {
	connect.query("SELECT tag FROM tag WHERE login = ?", [req.session.login], (err, rows, result) => {
		if (err) console.log(err)
		res.locals.tag = rows
	res.render('user_edit', { title: 'Express' })
	})
})

router.post('/', function(req, res, next) {
	var tag = req.body.tag	
	if (tag) {
		if (tag.length > 15) {
			req.session.error = 'Le tag est trop long'
			res.redirect('/user_edit')
		} else {
				connect.query("INSERT INTO tag SET login = ?, tag = ?", [req.session.login, tag], (err) => {
				if (err) console.log(err)
				req.session.success = 'Votre tag a bien ete ajoute'	
				req.session.info = 'Vous pouvez en ajouter autant que vous voulez'
				res.redirect('/user_edit')
			})
		} 	
	} else {
		req.session.error = 'Le champ est vide'
		res.redirect('/user_edit')
	}
})

router.get('/user_edit/del/:tag', function(req, res) {
	if (req.session && req.session.login) {
		connection.query('SELECT COUNT(*) AS count FROM tag WHERE login = ? AND tag = ?', [req.session.login, req.params.tag], (err, result) => {
            if (err) console.log(err)
            if (result[0] && result[0].count != 0) {
                connection.query('DELETE FROM tag WHERE login = ? AND tag = ?', [req.session.login, req.params.tag], (err) => {
                    if (err) console.log(err)
        			req.session.success = "Votre tag a bien ete supprime"
                    res.redirect('/user_edit')
                })
            }
        })
    } else if (req.session && req.session.user) {
        req.session.error = "Vous devez renseigner un tag."
        res.redirect('/user_edit')
    } else {
        req.session.error = "Vous devez être connecté pour accéder a cette page."
        res.redirect('/register')
		
	}
})

module.exports = router
