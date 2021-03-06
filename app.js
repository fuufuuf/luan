var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var app = express();

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var settings = require('./models/settings');
var flash = require('connect-flash');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
//app.use(session({
//		resave: false,	
//		saveUninitialized: true,
//		secret: settings.cookieSecret}
//));

	app.use(session({
	resave: false, 
	saveUninitialized: true,
	cookie: {maxAge:3600000},
	secret: settings.cookieSecret,
	store: new MongoStore({
	db: settings.db,
	host: settings.host,
	port: settings.port,
    username: settings.username,
    password: settings.password
	})
	}))
	
app.use(function(req,res,next){
	var e = req.flash('error');
    var s = req.flash('success');  
	res.locals.user=req.session.user;
 //   console.log('user ' + res.locals.user);
	res.locals.error = e.length?e:null;
   // console.log('error '+ res.locals.error);
	res.locals.success= s.length?s:null;
    //console.log('success '+ res.locals.success);
        next();
    });
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
