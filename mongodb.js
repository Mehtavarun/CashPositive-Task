const express = require('express');
const app = express();
const url = 'mongodb://varun:password@ds115352.mlab.com:15352/chat';
const mongo = require('mongodb').MongoClient;

mongo.connect(url,(err,db)=>{

	if(err) throw err;

	db.collection('samarasubs').findAndModify(
		
		{"Name":"john"},
    [['_id','asc']],
    { "$addToSet": { "hobbies":{
    	"msg":"ldfjldflkkladflk",
    	"touser":"lakjdffljalfkjlkdfjlsjflfljladsjflajkdfljkasldsfjk"
    }} },
    {new: true, upsert: true}
		,(err,result)=>{
		if(err) throw err;
	})

})
