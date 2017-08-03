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
	} else {
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

//Filling database

//		USERS
connection.query('CREATE TABLE IF NOT EXISTS user (id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, login VARCHAR(100) NOT NULL, name VARCHAR(100) NOT NULL, lastname VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL, passwd VARCHAR(255) NOT NULL, register DATE, age INT(3), sexe VARCHAR(25), city VARCHAR(255), description VARCHAR(10000) NOT NULL, interest VARCHAR(255), mainpic VARCHAR(255), pic1 VARCHAR(255), pic2 VARCHAR(255), pic3 VARCHAR(255), pic4 VARCHAR(255), online BOOLEAN DEFAULT FALSE)', function(err) {
	if (err) throw err;
	else {
		console.log('Table user created !');
	}
});

//End of connection
connection.end();
