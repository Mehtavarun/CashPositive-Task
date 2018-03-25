module.exports = (app, urlencodedParser, mongo, session, url)=>{




//authenticate user for login --------------------------------

	app.post('/login',(req,res)=>{

		mongo.connect(url, (err,db)=>{
			if(err) throw err;

			db.collection('CashPositive').find({Username:req.body.username, Password: req.body.password}).toArray((err,result)=>{
				if(err) throw err;

				if(result.length===0){

					//no user exists of that username or wrong username password
					res.send('<h2>Invalid Credentials</h2>');

				} else if(result.length===1) {

					req.session.username = req.body.username;
					req.session.password = req.body.password;
					//redirect to dashboard or wherever according to your choice

				}
			})
		})

	});



	//sending message to user --------------------------------

	app.post('/sendmessage',(req,res)=>{
		
		if(!req.session.username){
			
			res.send("<h1>Please Login first to send messages</h1>");
		} else{

				mongo.connect(url, (err,db)=>{
				if(err) throw err;


				db.collection('CashPositive').findOne({Username:req.body.toUser}, (err,result)=>{

					if(result.blockedUser[req.body.toUser]===true){
						
						res.send(`<h3>Sorry, You cannot message ${req.body.toUser}</h3>`);

					} else {

						//Adding message information to sender's collection

						db.collection('CashPositive').findAndModify(
					
							{"Username":req.session.username},
						    [['_id','asc']],
						    { 
						    	"$addToSet": { 
						    		"toUserMsg":{ 
						    			"toUser":req.body.toUser,
								    	"subject":req.body.msgSubject,
								    	"content":req.body.msgContent
									}
								}
							},
						    {
						    	new: true, 
						    	upsert: true
						    }
							
							,(err,result)=>{
								if(err) throw err;
							}
						);

						//Adding message information to receiver's collection

						db.collection('CashPositive').findAndModify(
					
							{"Username":req.body.toUser},
						    [['_id','asc']],
						    { 
						    	"$addToSet": { 
						    		"fromUserMsg":{ 
						    			"fromUser":req.session.username,
								    	"subject":req.body.msgSubject,
								    	"content":req.body.msgContent
									}
								}
							},
						    {
						    	new: true, 
						    	upsert: true
						    }
							
							,(err,result)=>{
								if(err) throw err;
							}
						);
					}
				});


			});
		}
	}

	});



	//registering new user to app --------------------------------

	app.post('/register',(req,res)=>{

		mongo.connect(url, (err,db)=>{
			if(err) {
				throw err;
			}

			db.collection('CashPositive').find({Username: req.body.username}).toArray((err,result)=>{

				if(err){
				 	throw err;
				}

				if(result.length>0){
						
						res.send('<h2>User already exists with username.</h2>');
						
						// if user already exists with current username 
						// than it will be checked using ajax 
						// or some other procedure


				} else {
					db.collection('CashPositive').insertOne({
						
						first: req.body.first,
						last:req.body.last, 
						Username: req.body.username, 
						Password: req.body.password,
						toUserMsg: [],
						fromUserMsg:[],
						blockedUser:[]

						//these array being empty or not will get checked on front end only 
						//for special symbols or invalid data on fields shall also be checked on front end

					},(err,result)=>{
						
						if(err) throw err;

						const user = {
							f_name: req.body.first,
							l_name: req.body.last,
							username: req.body.username
						}
						res.json(user);

						//user will be redirected to his profile or dashboard 
						//based on implementation of website 
						//res.redirect('/url'); 

					});
				}
			});
		});
	});



	//checking out all messages recieved --------------------------------

	app.get('/inbox',(req,res)=>{

		if(!req.session.username){
			res.send("<h1>Please Login first to see messages</h1>");
		} else{

			mongo.connect(url, (err,db)=>{
			if(err) throw err;

			db.collection('CashPositive').find({username: req.session.username}).toArray((err,result)=>{
				
					if(err) throw err;

					if(result.length<0){
						res.send("<h3>No messages to show.</h3>");
					} else {
						res.json(result.fromUserMsg);
					}
				}
			);
		});
		}

	});

	//blocking user to send message --------------------------------

	app.put('/block/:username',(req,res)=>{
		
		if(!req.session.username){
			res.send("<h2>Please Login first</h2>");
		} else{

			mongo.connect(url, (err,db)=>{
			if(err) throw err;

			db.collection('CashPositive').findAndModify(
			
					{"Username":req.session.username},
				    [['_id','asc']],
				    { 
				    	"$addToSet": { 
				    		"blockedUser":
				    			
				    			//blockUser is username of user to be blocked
				    			req.params.username:true
						}
					},
				    {
				    	new: true, 
				    	upsert: true
				    }
					
					,(err,result)=>{
						if(err) throw err;
					}
				);
		});
		}

		console.log(req.params.username);

	});

app.listen(6500);
}