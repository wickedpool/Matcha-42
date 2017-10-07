var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.session && req.session.login) {
		req.session.error = "Vous ne pouvez plus aller sur cette page"
		res.redirect('/home')
	} else {
  		res.render('index', { title: 'Express' })
	}
})

module.exports = router
