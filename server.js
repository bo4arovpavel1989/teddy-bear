var secret = require('./credentials.js');
var Admin=require('./lib/models/mongoModel.js').Admin;
var login = secret.login;
var loginUpperCase = login.toUpperCase();
var passwd = secret.passwd;
//var administrator = new Admin({login: login, loginUpperCase: loginUpperCase, passwd: passwd, session: '0'}).save();

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');
var server = require('http').createServer();

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', handlebars({defaultLayout: null}));
app.set('view engine', 'handlebars');
app.use(cookieParser());

var router = require('./lib/router.js').router;

server.on('request', app);

router(app);

server.listen(8080);

console.log('Server runs');