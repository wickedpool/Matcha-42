var express = require('express'),
	router = express.Router();

router.post('/', function(req, res) {
	if (req.body.login && req.body.name && req.body.lastname && req.body.email && req.body.age && req.body.gender)
	res.send("ON EST AL !");
});
module.exports = router;
