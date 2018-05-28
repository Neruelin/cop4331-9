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

app.post('/login', function (req, res) {
	console.log("receiving login info:");
    console.log(req.body);
	req.session.loggedin = true;
	let query = 'SELECT * FROM users WHERE username=\"' + req.body.username +'\";';
	console.log("Query :" + query);
	client.query(query, (err, res) => {
		let result = "";
		console.log(res.rows);
	});

    res.send("got the request", 200);
//res.sendFile(__dirname + '/public/html/dashboard.html');
});

app.post('/signup', function (req, res) {
	console.log("recieving signup info:");
	console.log(req.body);
	res.send("got signup", 200);
});

app.post('/add', function (req, res) {
	console.log("recieving add info:");
	console.log(req.body);
	res.send("got add", 200);
});

app.post("/contacts", function (req, res) {
	console.log("recieving contacts info:")
	console.log(req.body);
	res.send("got contact request", 200);
});

// for db debuggery
app.get('/db', function (req, res) {
	console.log("showing DB results");
	
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
