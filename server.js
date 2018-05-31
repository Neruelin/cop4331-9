const bcrypt = require("bcrypt");
const path = require('path');
const bodyparser = require('body-parser');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const csprng = require('csprng');
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const saltRounds = 10;

let globalSlot = "";

String.prototype.format = function() {
  a = this;
  for (k in arguments) {
    a = a.replace("{" + k + "}", arguments[k])
  }
  return a
}

// assumes validated input, 
function saltnhashnstore (userdata) {
	let result = {salt: undefined, hashword: undefined};
	bcrypt.genSalt(saltRounds, (err, salt) => {
		bcrypt.hash(userdata.password, salt, (err, hash) => {
			console.log("the hash: " + hash);
			if (hash != undefined) {
				let query= "INSERT INTO users (username, passwordhash, firstname, lastname, email) VALUES (\'" + userdata.username + "\', \'" + hash + "\', \'" + userdata.firstname + "\', \'" + userdata.lastname + "\', \'" + userdata.email + "\');";
				client.query(query, (err, res) => {   
					if (err) {
						console.log(err.stack);
					} else {
						console.log(res.rows[0]);
					}
				});
			}
		}); 
	});
}

// Returns true if a prohibited character is detected, returns false otherwise
function checkInput(inputobj) {
	console.log(typeof inputobj["username"]);
	let prohibitedChars = ['\"', '\'', ';']
	for (let key in inputobj) {
		for (let char in prohibitedChars) {
			if ((inputobj[key]).indexOf(char) > -1) {
				console.log("invalid char of: " + inputobj[key] + " char: " + prohibited[char]);
				return true;
	}}}
	return false;
}


	/*client.query('SELECT * FROM usertable', (err, res) => { // dump db into variable
		var dbresult = "";
		if (err) throw err;
		console.log(res);
	});*/
// client.connect();

// client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });

const app = express(); // main app object

const port = process.env.PORT || 8080; // uses server env port if exists, else uses default 8080
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}))
app.use(cookieParser());
app.use(session({secret: csprng(256, 36)}));

/* defining static content directories
   Eg: accessing "domain.com/views" will actually access "server_directory/public/html/"
   frontend dir name             backend dir name
		 |			                  |               */
app.use('/', 		express.static('public/'));
app.use('/media', 	express.static('public/media/'));
app.use('/html', 	express.static('public/html/'));
app.use('/css', 	express.static('public/css/'));
app.use('/js', 		express.static('public/js/'));

// routes
client.connect(); // connect to db
// for homepage get requests
app.get('/', function (req, res) {
	console.log("Serving login.html");
	res.sendFile(__dirname + '/public/html/login.html');
});

app.post('/login', function (req, response) {
	console.log("receiving login info:");
    console.log(req.body);
    if ( req.body.username.length > 50 ||
    	 checkInput(req.body)) {
    	console.log("status 400 ln 107");
    	response.status(400).end();
    	return;
    } else {	
		let query = 'SELECT * FROM users WHERE username=\'' + req.body.username +'\';';
		client.query(query, (err, res) => {
			if (res.rows.length == 1) {
				bcrypt.compare(req.body.password, res.rows[0].passwordhash, (err, same) => {
					console.log("password compare: " + same);
					if (same) {
						req.session.loggedin = true;
						console.log("redirecting to dash");
						response.redirect('/dashboard');
					} else {
						console.log("status 401 ln 122");	
						response.status(401).end();
					}
				});
			} else {
		    	console.log("status 400 ln 126");
				response.status(400).end();
			}
		});
    }
//res.sendFile(__dirname + '/public/html/dashboard.html');
});

app.post('/signup', function (req, res) {
	console.log("recieving signup info:");
	console.log(req.body);
	if ( /*req.body.username.length > 50 ||
		 req.body.firstname.length > 50 ||
    	 req.body.lastname.length > 50 ||
    	 req.body.email.length > 50 ||*/
    	 checkInput(req.body)) {
		res.status(400).end();
		return;
	} else {
		saltnhashnstore(req.body);
		res.send("got signup", 200);
	}
});

app.post('/add', function (req, res) {
	console.log("recieving add info:");
	console.log(req.body);
	res.send("got add", 200);
});

app.get("/contacts", function (req, res) {
	console.log("recieving contacts info:")
	//console.log(req.body);
	res.send("got contact request", 200);
});

// for db debuggery
app.get('/db', function (req, res) {
	console.log("showing DB results");
	//console.log(globalSlot);

	client.query('SELECT * FROM users', (err, res2) => { // dump db into variable
		var dbresult = "";
		if (err) throw err;
		console.log(res2);
		for (let row of res2.rows) {
			dbresult += JSON.stringify(row) + "\n";
		}
		//client.end();
		console.log(dbresult);
		res.send(dbresult);
	});

});

app.get('/db1', function (req, res) {
	console.log("showing DB query");
	console.log(globalSlot);
	saltnhashnstore({username:"testuser", firstname:"test", lastname:"user", email:"testuser@test.com", password:"BananaPhone"});
	res.send(globalSlot);	
});

app.get('/dashboard', function (req, res) {
	if (req.session.loggedin) {
		console.log("Serving dashboard.html");
		res.sendFile(__dirname + '/public/html/dashboard.html');
	} else {
		res.redirect("/login");
	}
});

// start app on port
app.listen(port, () => console.log("active on port: " + port));
