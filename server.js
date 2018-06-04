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

	var hash = bcrypt.hashSync(userdata.password, saltRounds);
	let query= "INSERT INTO users (username, passwordhash, firstname, lastname, email) VALUES (\'" + userdata.username + "\', \'" + hash + "\', \'" + userdata.firstname + "\', \'" + userdata.lastname + "\', \'" + userdata.email + "\');";

	client.query(query, (err, res) => {
		if (err) {
			console.log(err.stack);
		} else {
			console.log(res.rows[0]);
		}
	});	
	/*
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
	*/
}

// Returns true if a prohibited character is detected, returns false otherwise
function checkInput(inputobj) {
	//xconsole.log(typeof inputobj["username"]);
	let prohibitedChars = ['\"', '\'', ';']
	for (let key in inputobj) {
		for (let char in prohibitedChars) {
			if ((inputobj[key]).indexOf(prohibitedChars[char]) > -1) {
				console.log("invalid char of: " + inputobj[key] + " char: " + prohibitedChars[char]);
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
	req.session.loggedin = false;
	console.log("Serving login.html");
	res.sendFile(__dirname + '/public/html/login.html');
});

app.get('/login', function (req, res) {
	req.session.loggedin = false;
	console.log("Serving login.html");
	res.sendFile(__dirname + '/public/html/login.html');
});

var id = 1;

app.post('/login', function (req, response) {
	console.log("receiving login info:");
    console.log(req.body);
    if ( req.body.username.length > 50 ||
    	 checkInput(req.body)) {
    	response.status(400).end();
    	return;
    } else {	
		let query = 'SELECT * FROM users WHERE username=\'' + req.body.username +'\';';
		client.query(query, (err, res) => {
			if (res.rows.length == 1) {
				bcrypt.compare(req.body.password, res.rows[0].passwordhash, (err2, same) => {
					console.log("password compare: " + same);
					if (same) {
						req.session.loggedin = true;
						req.session.id = res.rows[0].id;

						console.log("redirecting to dash");

						//response.send(res.rows[0], 200);
						response.status(200).send(res.rows[0]);


					} else {
						response.status(401).end();
					}
				});
			} else {
				response.status(400).end();
			}
		});
    }

});

app.post('/signup', function (req, res) {
	console.log("recieving signup info:");
	console.log(req.body);
	if ( checkInput(req.body)) {
		res.status(400).end();
		return;	
	} else {
		//saltnhashnstore(req.body);

		//let result = {salt: undefined, hashword: undefined};
		let userdata = req.body;
		var hash = bcrypt.hashSync(userdata.password, saltRounds);
		let query= "INSERT INTO users (username, passwordhash, firstname, lastname, email) VALUES (\'" + userdata.username + "\', \'" + hash + "\', \'" + userdata.firstname + "\', \'" + userdata.lastname + "\', \'" + userdata.email + "\');";

		client.query(query, (err, res) => {
			if (err) {
				console.log(err.stack);
			}
		});

		res.status(200).send("got signup");
	}
});

app.post('/add', function (req, res) {
	console.log("recieving add info:");
	console.log(req.body);
	let query= "INSERT INTO contacts (id, fname, lname, phonenumber, email, address, city, state, zipcode) VALUES (\'" + req.session.id+ "\', \'" + req.body.firstName + "\', \'" + req.body.lastName + "\', \'" + req.body.phone + "\', \'" + req.body.email + "\', \'" + req.body.street + "\', \'" + req.body.city + "\', \'" + req.body.state + "\', \'" + req.body.zip + "\');";
	console.log(query);
				client.query(query, (err, res2) => {   
					if (err) {
						console.log(err.stack);
					} else {
						console.log(res2);
					}
				});
	res.send("got add", 200);
});

app.post('/delete', function (req, res) {
	console.log("recieving add info:");
	console.log(req.body);
	let query= "DELETE FROM contacts WHERE id = \'" + req.session.id + "\' AND fname = \'" + req.body.firstName + "\' "+
	"AND lname = \'" + req.body.lastName + "\' AND phonenumber = \'" + req.body.phone + "\' AND email = \'" + req.body.email + "\'"+
	" AND address = \'" + req.body.street + "\' AND city = \'" + req.body.city + "\' AND state = \'" + req.body.state + "\' AND zipcode = \'" + req.body.zip + "\';";
	console.log(query);
				client.query(query, (err, res2) => {   
					if (err) {
						console.log(err.stack);
					} else {
						console.log(res2);
					}
				});
	res.send("deleted", 200);
});

app.post("/contacts", function (req, res) {
	console.log("recieving contacts info:")
	console.log(req.body);
	let query = 'SELECT * FROM contacts WHERE id =\'' + req.session.id + '\' AND ((fname || \' \' || lname) LIKE \'' + req.body.search + '%\' OR lname LIKE \'' + req.body.search + '%\');';
	console.log(query)
	client.query(query, (err, res2) => {
		if (err) {
			console.log(err.stack);
		} else {
			console.log(res2);
			if (res2.rowCount != 0) res.status(200).send(res2.rows); //you fucking forgot to put the [0] index. we'll maybe take this out eventually
			else res.status(404).end();
		}
	});
	
});

// dumps user table if logged in
app.get('/db', function (req, res) {
	console.log("showing DB results");
	if (req.session.loggedin == true) {
		client.query('SELECT * FROM users', (err, res2) => { // dump db into variable
			var dbresult = "";
			if (err) throw err;
			console.log(res2);
			for (let row of res2.rows) {
				dbresult += JSON.stringify(row) + "\n";
			}
			console.log(dbresult);
			res.send(dbresult);
		});
	} else {
		res.status(401).end();
	}
});

app.get('/dashboard', function (req, res) {
	if (req.session.loggedin) {
		console.log("Serving dashboard.html");
		console.log(__dirname);
		return res.status(200).sendFile(__dirname + '/public/html/dashboard.html');
		
	} else {
		res.redirect("/login");
	}
});

// start app on port
app.listen(port, () => console.log("active on port: " + port));
