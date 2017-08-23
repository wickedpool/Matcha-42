var express = require('express'),
	router = express.Router();

router.post('/', function(req, res) {
	res.send("ON EST AL !");
});
module.exports = router;
