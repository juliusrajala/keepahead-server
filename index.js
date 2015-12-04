var express = require('express');
var fs = require('fs');
var path = require('path');
// var PythonShell = require('python-shell');
var app = express();

var JSON_FILE_PATH = "Something";

//HTTP POST callback for receiving data
app.post("/postlocation", function(req, res){
	console.log(req.body);
	console.log("End");
});

//HTTP GET callback for delivering data
app.get("/getlocation", function(req, res){

});