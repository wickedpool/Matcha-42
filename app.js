var express = require('express')
var path = require('path')
//var favicon = require('serve-favicon')
var logger = require('morgan');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')
var toastr = require('toastr')
var jquery = require('jquery')

var index = require('./routes/index')
var register = require('./routes/register')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
	secret: "i901884384jdowkkd",
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}))

app.use(function (req, res, next) {
	if (req.session) {
		if (req.session.error) {
			res.locals.error = req.session.error
			req.session.error = undefined
		}
	}
	next()
})

//Routes
app.use('/', index)
app.use('/register', register)

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

