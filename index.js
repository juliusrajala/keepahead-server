var express = require('express');
var fs = require('fs');
var path = require('path');
// var PythonShell = require('python-shell');
var app = express();

var JSON_FILE_PATH = "Something";
var PORT = 3000;

//HTTP POST callback for receiving data
app.post("/hot4guysapi/post", function(req, res){
	console.log(req.body);
	console.log("HTTP POST done.");
});

//HTTP GET callback for delivering data
app.get("/getlocation", function(req, res){
	console.log("Someone tried to get stuff.");
});

console.log("Listening to port "+ PORT);

app.listen(3000);