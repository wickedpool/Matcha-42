//connection

var mysql      = require('mysql');

var connection = mysql.createConnection({
	host     : 'localhost',
	port     : 3307,
//	port	 : 3306,
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
connection.query('CREATE TABLE IF NOT EXISTS user (id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, login VARCHAR(100) NOT NULL, name VARCHAR(100) NOT NULL, lastname VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL, passwd VARCHAR(255) NOT NULL, register DATETIME, age INT(3), sexe VARCHAR(25), city VARCHAR(255), description VARCHAR(10000), interest VARCHAR(255), mainpic VARCHAR(255), pic1 VARCHAR(255), pic2 VARCHAR(255), pic3 VARCHAR(255), pic4 VARCHAR(255), online BOOLEAN DEFAULT FALSE, latitude FLOAT, longitude FLOAT)', function(err) {
	if (err) throw err;
	else {
		console.log('Table user created !');
	}
});

//		TAGS
connection.query('CREATE TABLE IF NOT EXISTS tag (id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, login VARCHAR(100) NOT NULL, tag VARCHAR(16))', function(err) {
	if (err) throw err;
	else {
		console.log('Table tag created');
	}
});

//		POPULARITY
connection.query('CREATE TABLE IF NOT EXISTS popularity (id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, login VARCHAR(100) NOT NULL, famous INT(6) NOT NULL)', function(err) {
	if (err) throw err;
	else {
		console.log('Table popularity created !');
	}
});

//		LIKE
connection.query('CREATE TABLE IF NOT EXISTS liked (id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, login VARCHAR(100) NOT NULL, liked VARCHAR(100) NOT NULL)', function(err) {
	if (err) throw err;
	else {
		console.log('Table like created !');
	}
});

//End of connection
connection.end();
