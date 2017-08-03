//connection

var mysql      = require('mysql');

var connection = mysql.createConnection({
	host     : 'localhost',
	port     : 3307,
	user     : 'root',
	password : 'root',
});

//Catching errors

connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}
	else {
		console.log('connected');
		return;
	}
});

//Db creation

connection.query('CREATE DATABASE IF NOT EXISTS matcha');

console.log('Database matcha Created !');

//Choosing db

connection.query('USE matcha');

console.log('Database changed !');

//Filling db

connection.query();

//End of connection
connection.end();
