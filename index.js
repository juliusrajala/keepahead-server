var express = require('express');
var fs = require('fs');
var path = require('path');
// var PythonShell = require('python-shell');
var app = express();

var JSON_FILE_PATH = "Something";
var PORT = 3000;

//HTTP POST callback for receiving data
app.post("/hot4guysapi/post", function(req, res){
	console.log("Logging body next");
	console.log(req.body);
	console.log("Now logging whole req");
	console.log(req)
	console.log("HTTP POST done.");
});

//HTTP GET callback for delivering data
app.get("/getlocation", function(req, res){
	console.log("Someone tried to get stuff.");
});

console.log("Listening to port "+ PORT);

app.listen(process.env.Port || 3000);