let express = require('express'),
	app = express();
	//connexion = require('./config/database);

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
	reponse.render('pages/index');
})

/*
 * var server = http.createServer(function(req, res) {
    fs.readFile('./route/index.html', 'utf-8', function(error, content) {
		if (error) {
			throw error;
		}
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
}); 
*
*/

server.app.listen(8080);
