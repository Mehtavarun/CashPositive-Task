module.exports = (app, urlencodedParser, mongo, session, url)=>{




//authenticate user for login --------------------------------

app.post('/login',(req,res)=>{

	const user = {
		username:req.body.username,
		password:req.body.password
	};

	console.log(`login user: ${user.username}` );

});

//sending message to user --------------------------------

app.post('/sendmessage',(req,res)=>{
	
	const msg = {
		subject:req.body.msgsubject,
		contect:req.body.msgcontect,
		touser:req.body.touser
	};

	console.log(`Msg Subject: ${msg.subject}`);

});

//registering new user to app --------------------------------

app.post('/register',(req,res)=>{
	
	const newUser = {
		fname:req.body.fname,
		lname:req.body.lname,
		username:req.body.username,
		password:req.body.password
	};

	console.log(`New User: ${newUser}`);

});

//checking out all messages recieved --------------------------------

app.get('/inbox',(req,res)=>{

	if(!req.session.username){
		res.send("<h1>Please Login first to see messages</h1>");
		} else{
			res.send("<h1>Messages from users</h1>");

		// 	mongo.connect(url, (err,db)=>{
		// 	if(err) throw err;

		// 	db.collection('firstbookquery').insertOne({Name: req.query.name, Email: req.query.email, Message: req.query.mess}, (err,result)=>{
		// 		if(err) throw err;
		// 	});
		// });
		}

});

//blocking user to send message --------------------------------

app.put('/block/:username',(req,res)=>{
	
	console.log(req.params.username);

});

app.listen(6500);}