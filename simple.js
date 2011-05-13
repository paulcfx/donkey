var http = require('http');
var express = require('express');

var app = express.createServer();


app.get('/', function(req, res) {
	res.send ('this is a test');
});

app.listen(3000);