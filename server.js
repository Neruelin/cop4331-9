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

// Returns true if a prohibited character is detected, returns false otherwise
function checkInput(inputobj) {
	let prohibitedChars = ['\"', '\'', ';']
	for (let key in inputobj) {
		if (inputobj[key].length > 50) return true;
		for (let char in prohibitedChars) {
			if ((inputobj[key]).indexOf(prohibitedChars[char]) > -1) {
				console.log("invalid char of: " + inputobj[key] + " char: " + prohibitedChars[char]);
				return true;
				}
			}
		}
	return false;
}

const app = express(); // main app object

const port = process.env.PORT || 8080; // uses server env port if exists, else uses default 8080
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}))
app.use(cookieParser());
app.use(session({secret: csprng(256, 36)}));
app.use(function (req, res, next) {
	console.log(req.body);
	checkInput(req.body)
	next();
});

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
	if (req.session.loggedin != true) {
		console.log("Serving login.html");
		res.sendFile(__dirname + '/public/html/login.html');
	} else {
		res.redirect("/dashboard");
	}
});

app.get('/login', function (req, res) {
	if (req.session.loggedin != true) {
		console.log("Serving login.html");
		res.sendFile(__dirname + '/public/html/login.html');
	} else {
		res.redirect("/dashboard");
	}
});

app.post('/login', function (req, response) {
	console.log("receiving login info:");
    if ( req.body.username > 50 ||
    	 checkInput(req.body)) {
    	response.status(400).end();
    } else {	
		let query = 'SELECT * FROM users WHERE username=\'' + req.body.username +'\';';
		client.query(query, (err, res) => {
			if (res.rowCount == 1) {
				bcrypt.compare(req.body.password, res.rows[0].passwordhash, (err2, same) => {
					console.log("password compare: " + same);
					if (same) {
						req.session.loggedin = true;
						req.session.userid = res.rows[0].id;
						console.log("redirecting to dash");
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

app.get('/logout', function (req, res) {
	req.session.loggedin = false;
	req.session.id = undefined;
	res.redirect("/login");
})

app.post('/signup', function (req, res) {
	console.log("recieving signup info:");
	if (checkInput(req.body)) {
		res.status(400).end();
	} else {
		let userdata = req.body;
		let hash = bcrypt.hashSync(userdata.password, saltRounds);
		let query = "INSERT INTO users (username, passwordhash, firstname, lastname, email) VALUES (\'" + userdata.username + "\', \'" + hash + "\', \'" + userdata.firstname + "\', \'" + userdata.lastname + "\', \'" + userdata.email + "\');";

		client.query(query, (err, res) => {
			if (err) {
				console.log(err.stack);
			}
		});
		res.status(200).end();
	}
});

app.post('/add', function (req, res) {
	console.log("recieving add info:");
	if (req.session.loggedin) {
		let query = "INSERT INTO contacts (id, fname, lname, phonenumber, email, address, city, state, zipcode) VALUES (\'" + req.session.userid+ "\', \'" + req.body.firstName + "\', \'" + req.body.lastName + "\', \'" + req.body.phone + "\', \'" + req.body.email + "\', \'" + req.body.street + "\', \'" + req.body.city + "\', \'" + req.body.state + "\', \'" + req.body.zip + "\');";
		console.log(query);
			client.query(query, (err, res2) => {   
				if (err) {
					console.log(err.stack);
				} else {
					console.log(res2);
				}
			});
		res.status(200).end();
	} else {
		res.redirect("/login");
	}
});

app.post('/delete', function (req, res) {
	console.log("recieving add info:");
	if (req.session.loggedin) {
		//let query = "DELETE FROM contacts WHERE id = \'" + req.session.userid + "\' AND fname = \'" + req.body.firstName + "\' "+
		//"AND lname = \'" + req.body.lastName + "\' AND phonenumber = \'" + req.body.phone + "\' AND email = \'" + req.body.email + "\'"+
		//" AND address = \'" + req.body.street + "\' AND city = \'" + req.body.city + "\' AND state = \'" + req.body.state + "\' AND zipcode = \'" + req.body.zip + "\';";
		let query = "DELETE FROM contacts WHERE id=\'" + req.session.userid + "\' AND contactId=" + req.body.id + ";";
		console.log(query);
		client.query(query, (err, res2) => {   
			if (err) {
				console.log(err.stack);
			}
		});
		res.status(200).end();
	} else {
		res.redirect("/login");
	}
});

app.post("/contacts", function (req, res) {
	console.log("recieving contacts info:")
	if (req.session.loggedin) {
		let query = 'SELECT * FROM contacts WHERE id =\'' + req.session.userid + '\';';
		client.query(query, (err, res2) => {
			if (err) {
				console.log(err.stack);
			} else {
				if (res2.rowCount != 0) res.status(200).send(res2.rows);
				else res.status(404).end();
			}
		});
	} else {
		res.redirect("/login");
	}
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
		res.redirect("/login");
	}
});

app.get('/dashboard', function (req, res) {
	if (req.session.loggedin) {
		console.log("Serving dashboard.html");
		return res.status(200).sendFile(__dirname + '/public/html/dashboard.html');
	} else {
		res.redirect("/login");
	}
});

// start app on port
app.listen(port, () => console.log("active on port: " + port));
