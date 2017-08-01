var express = require('express'),
	app = express(),
	http = require('http'),
	path = require('path');
	//connexion = require('./config/database);

var	index = require('./routes/index.html');

app.use(express.static('public'));

var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
		if (error) {
			throw error;
		}
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

server.app.listen(8080);

app.
