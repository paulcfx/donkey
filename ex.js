var express = require('express');
var app     = express.createServer();

app.get('/', function(req, res) {
	res.send('this is my test for real!');
});

app.get('/search', function(req, res) {
	res.send('search page');
});

app.listen(3000);