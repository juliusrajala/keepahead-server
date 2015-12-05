var Hapi = require('hapi');
var fs = require('fs');
var path = require('path');
var apiServer = new Hapi.Server();

var settings = {
    httpPort: process.env.PORT,
    apiPath: '/api/post',
    // httpHost: '0.0.0.0'
}

function startAPI(settings) {
  console.log("Seeing if this even gets called.");

  var temperature = 0.0;

  apiServer.connection({
    host: settings.httpHost,
    port: settings.httpPort
  });

  apiServer.route({
    method: 'POST',
    path: settings.apiPath,
    handler: function(request, reply) {
      var deviceId = request.headers.deviceauthuuid ? request.headers.deviceauthuuid : 'unknown';
      console.log('Received POST data: device' + deviceId);
	  //Do something with the data from a Thingsee One
	  // console.log( request.payload );
      var dData = JSON.stringify(request.payload);
      var sensData = request.payload[0].senses;
      console.log(dData);
      console.log(request.payload[0].senses);
      console.log("----------------Clearing data---------------");
      for(value in sensData){
        console.log(value);
        if(value.sId == "0x00060100"){
          temperature = value.val;
          console.log("Temperature set to: " + temperature);
        }
      }
      // temperature = (request.payload[0].senses[0].val);

      // console.log("temperature: " + temperature);
      reply("Something happened.");
    }
  });

  apiServer.route({
    method: 'GET',
    path: '/hello',
      handler: function (request, reply) {
        reply('Hello!');
    }
  });

  apiServer.route({
    method: 'GET',
    path: '/temperature',
    handler: function(request, reply) {
      var response = "Temperature: " + temperature + "C";

      reply(response);
    }
  });

  apiServer.start(function() {
    console.log('APIServer running at:', apiServer.info.uri);
  });
}

startAPI(settings);
