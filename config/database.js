let mysql = require('mysql');

let connexion = mysql.createConnection({
	host	 : 'localhost',
//	port	 : 3307,
	port	 : 3306,
	user	 : 'root',
	password : 'root',
	database : 'matcha'
});

connexion.connect();

module.exports = connexion;
