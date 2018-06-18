var express = require('express');
var bodyparser = require('body-parser');
var app = express();
var http = require('http');
var path = require("path");

var handlebars = require('express-handlebars').create({defaultLayout:'main'});
//require the dbs
require('./db');
require('./db');
require('./auth');

var passport = require('passport');
var session = require('express-session');
var sessionOptions = {
	secret: 'secret cookie thang (store this elsewhere!)',
	resave: true,
	saveUninitialized: true
};
app.use(session(sessionOptions));

//require the model that was registerd with mongoose
var mongoose = require('mongoose');
var List = mongoose.model('List');
var routes = require('./routes/index');
app.set('views', path.join(__dirname, 'views'));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.urlencoded({extended: false}));
app.engine('handlebars', handlebars.engine);
app.use('/', routes);
app.set('view engine', 'handlebars');

app.use(function(req, res, next){
	res.locals.user = req.user;
	next();
});

module.exports = app;
app.listen(3000);
