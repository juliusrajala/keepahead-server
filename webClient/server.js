var express = require('express');
var React = require('react');
var path = require('path');
var app = express();

var htmlFilePath = path.join(__dirname, '/client/index.html');

//Makes the directory static and ready to be served along with styles etc.
app.use(express.static(__dirname + '/client/'))

//Serves a static file at a specific directory.
app.get('/', function(req, res){
	try{
		res.sendFile(htmlFilePath);
	}catch(err){
		console.log(err);
	}
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
	console.log('listening on port ' + port);
});