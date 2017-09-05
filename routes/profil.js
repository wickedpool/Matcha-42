var express = require('express')
var router = express.Router()

router.get('/profil', function(req, res, next) {
	res.render('profil', { title: 'Express' })
})

module.exports = router
