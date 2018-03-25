const express = require('express');
const app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});
const url = 'mongodb://varun:password@ds115352.mlab.com:15352/chat';
const session = require('express-session');
const mongo = require('mongodb').MongoClient;

app.use(session(
		{
			secret:'secret',
		    resave: true,
		    saveUninitialized: true
		}
	));

app.use(bodyParser.json());

require('./routes.js')(app, urlencodedParser, mongo, session, url);

app.listen(6500);
