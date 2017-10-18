var		express = require('express'),
 		path = require('path'),
		favicon = require('serve-favicon'),
		app = express(),
 		logger = require('morgan'),
		connect = require('./config/database.js')
		cookieParser = require('cookie-parser'),
	 	bodyParser = require('body-parser'),
    	session = require('express-session'),
		server = require('http').createServer(app),
		bcrypt = require('bcrypt'),
		socketIOSession = require("socket.io.session")

app.io = require('socket.io')(server)

var		session = require("express-session")({
			secret: "i901884384jdowkkd",
			resave: true,
			saveUninitialized: true
		})

var 	index = require('./routes/index'),
		register = require('./routes/register'),
		login = require('./routes/login'),
		profil = require('./routes/profil'),
		logout = require('./routes/logout'),
		home = require('./routes/home'),
		edit = require('./routes/user_edit'),
		message = require('./routes/message'),
		chat = require('./routes/chat'),
		user = require('./routes/user'),
		block = require('./routes/block'),
		unblock = require('./routes/unblock'),
		fake = require('./routes/fake'),
		forgot = require('./routes/forgot'),
		reset = require('./routes/reset'),
		search = require('./routes/search'),
		notif = require('./routes/notif')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(session)
//io.use(socketIOsession(session))

app.use(function (req, res, next) {
	if (req.session) {
		if (req.session.error) {
			res.locals.error = req.session.error
			req.session.error = undefined
		}
		if (req.session.success) {
			res.locals.success = req.session.success
			req.session.success = undefined
		}
		if (req.session.warning) {
			res.locals.warning = req.session.warning
			req.session.warning = undefined
		}
		if (req.session.info) {
			res.locals.info = req.session.info
			req.session.info = undefined
		}
	}
	next()
})

app.use(function(req, res, next) {
	res.locals.login = req.session.login
	res.locals.sexe = req.session.sexe
	res.locals.lastname = req.session.lastname
	res.locals.name = req.session.name
	res.locals.age = req.session.age
	res.locals.ok = req.session.ok
	res.locals.interest = req.session.interest
	res.locals.descri = req.session.descri
	res.locals.mainpic = req.session.mainpic
	res.locals.log = req.session.log
  next()
})

//Routes
app.use('/', index)
app.use('/register', register)
app.use('/login', login)
app.use('/profil', profil)
app.use('/user_edit', edit)
app.use('/home', home)
app.use('/logout', logout)
app.use('/user', user)
app.use('/chat', chat)
app.use('/message', message)
app.use('/notif', notif)
app.use('/fake', fake)
app.use('/forgot', forgot)
app.use('/block', block)
app.use('/search', search)
app.use('/reset', reset)
app.use('/unblock', unblock)

var people = {}
app.io.on('connection', function(socket){
	console.log('a user connected')
	var me = false
	socket.on('log', function(user){
		connect.query("UPDATE user SET online = 1 WHERE login = ?", [user.login], (err) => {
			if (err) threw (err)
			people[user.login] = socket.id
		})
	})
	console.log('==========1stPEOPLE==============')
	console.log(people)

	socket.on('parse', function(parse){
		console.log('==========PARSE==============')
		console.log(people)
		people[parse.login] = socket.id
	})

	console.log('=========2ndPEOPLE============')
	console.log(people)

	socket.on('newmsg', function(message){
		if (message == '')
			return false
		console.log('========================')
		console.log(message.moi)
		console.log(message.recup)
		console.log('========================')
		message.user = message.moi
		date = new Date()
		message.h = date.getHours()
		message.m = date.getMinutes()
		connect.query('INSERT INTO message SET login = ?, sendat = ?, user = ?, message = ?', [message.moi, date, message.recup, message.message], (err) => {
			var notifmsg = message.recup + ' Vous a envoye un message'
			connect.query('INSERT INTO notif SET login = ?, sendat = ?, type = ?, msg = ?, readed = 0', [message.moi, date, "message", notifmsg], (err) => {
				if (err) console.log(err)
				console.log('========================')
				console.log(people[message.moi])
				console.log(people[message.recup])
				console.log(people)
				console.log('========================')
				socket.send(people[message.moi]).emit('newmsgs', {
					name: message.moi,
					message: message.message,
					h: message.h,
					m: message.m,
					recup: message.recup
				})
			})
		})
	})
	socket.on('disconnect', function () {
		console.log('disconnect')
		if (!me) {
			return false
		}
		connect.query("UPDATE user SET online = 0 WHERE login = ?", [me], (err) => {
			if (err) threw (err)
		})
  	})
})
global.people = people

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.err = req.app.get('env') === 'development' ? err : {}

  // render the error page
	console.log(err)
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
