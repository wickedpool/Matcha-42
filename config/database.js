let mysql = require('mysql');

let connexion = mysql.createConnection({
	host	 : 'localhost',
//	port	 : 3306,
	port	 : 3307,
	user	 : 'root',
	password : 'root',
	database : 'matcha'
});

connexion.connect();

module.exports = connexion;
