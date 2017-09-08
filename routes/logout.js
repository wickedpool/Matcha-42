var express = require('express')
var router = express.Router()
var session = require('express-session')
var connection = require('../config/database.js')

router.get('/', function(req, res) {
	if (req.session && req.session.login) {
		connection.query("UPDATE user SET online = 0 WHERE login = ?", [req.session.login], (err) => {
			if (err) console.log(err)
		})
	}
	req.session.destroy()
	res.redirect('/')
})

module.exports = router
