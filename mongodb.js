const express = require('express');
const app = express();
const url = 'mongodb://varun:password@ds115352.mlab.com:15352/chat';
const mongo = require('mongodb').MongoClient;

mongo.connect(url,(err,db)=>{

	if(err) throw err;

	db.collection('samarasubs').insertOn({Name:"john", hobbies:[]},(err,result)=>{
		if(err) throw err;

		console.log(result);
	})

})
