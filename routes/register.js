var express = require('express');
	connect = require(../config/database.js);
	app = express.Router();

app.post('/', function(req, res) {
	res.send("ON EST AL !");
});
