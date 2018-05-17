const path = require('path');
const express = require('express');

const app = express(); // main app object

const port = process.env.PORT || 8080; // uses server env port if exists, else uses default 8080

/* defining static content directories
   Eg: accessing "domain.com/views" will actually access "server_directory/public/html/"
   frontend dir name            backend dir name
		   |			                |          */
app.use("/views", express.static('public/html/'));
app.use("/style", express.static('public/css'));
app.use("/js", express.static('public/js'));
app.use("/", express.static('public'));

// routes

// for homepage get requests
app.get('/', function (req, res) {
	console.log("Serving index.html");
	res.sendFile(__dirname + '/public/html/index.html');
});




// start app on port
app.listen(port, () => console.log("active on port: " + port));