var express = require('express');
var fs = require('fs');
var path = require('path');
// var PythonShell = require('python-shell');
var app = express();

var JSON_FILE_PATH = "Something";

app.get('/', function (req, res) {
    var remoteAddress = req.headers['x-forwarded-for'] || 
                      req.connection.remoteAddress;
    res.json({ "ipAddress": remoteAddress });
});

//HTTP POST callback for receiving data
app.post("/hot4guysapi/post", function(req, res){
	console.log("Logging body next");
	console.log(req.body);
	console.log("Now logging whole req");
	console.log(req)
	console.log("HTTP POST done. Logging payload.");
	console.log(req.payload);
});

//HTTP GET callback for delivering data
app.get("/getlocation", function(req, res){
	console.log("Someone tried to get stuff.");
});

app.listen(process.env.PORT || 5000);