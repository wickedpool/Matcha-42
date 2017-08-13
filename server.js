let express = require('express')

let app = express()
	//connexion = require('./config/database);

//let login = require('./routes/login')

app.set('view engine', 'ejs')

app.use(express.static('public'))
//app.use('/login', login)

app.get('/', (req, res) => {
	res.render('pages/index')
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

app.use(function (req, res, next) {
  res.status(404).send("Sorry cannot find that !")
})

app.listen(8080)
