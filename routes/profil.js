var express = require('express')
var router = express.Router()

router.get('/', function(req, res, next) {
	res.render('profil', { title: 'Express' })
})

router.post('/', function(req, res) {
	
})

module.exports = router
