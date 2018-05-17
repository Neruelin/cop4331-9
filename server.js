const path = require('path');
const express = require('express');
const { Client } = require('pg');

const client = new Client({
	connnectionString: process.env.DATABASE_URL,
	ssl: true,
});


const app = express(); // main app object

const port = process.env.PORT || 8080; // uses server env port if exists, else uses default 8080

/* defining static content directories
   Eg: accessing "domain.com/views" will actually access "server_directory/public/html/"
   frontend dir name             backend dir name
		 |			                  |               */
app.use('/', 		express.static('public/'));
app.use('/media', 	express.static('public/media/'));
app.use('/html', 	express.static('public/html/'));
app.use('/style', 	express.static('public/css/'));
app.use('/js', 		express.static('public/js/'));

// routes

// for homepage get requests
app.get('/', function (req, res) {
	console.log("Serving index.html");
	res.sendFile(__dirname + '/public/html/index.html');
});
// for db debuggery
app.get('/db', function (req, res) {
	console.log("showing DB results");
	var dbresult = "";
	var query = 'SELECT datname FROM pg_database WHERE datistemplate = false;';
	client.connect(); // connect to db

	client.query(query, (err, res) => { // dump db into variable
		if (err) throw err;
		for (let row of res.rows) {
			dbresult += JSON.stringify(row) + "\n";
		}
		client.end();
	})

	res.send(dbresults); // send results to browser
});



// start app on port
app.listen(port, () => console.log("active on port: " + port));