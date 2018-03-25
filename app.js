const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const urlencodedParser = bodyParser.urlencoded({extended:false});
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
