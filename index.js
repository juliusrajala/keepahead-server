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

  var ACC_LO_ID = "0x00050100";
  var ACC_LA_ID = "0x00050200";
  var ACC_VE_ID = "0x00050300";
  var TEMP_ID = "0x00060100";

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
      console.log(sensData);
      console.log("----------------Clearing data---------------");
      for(var key in sensData){
        console.log("sensor value: " + JSON.stringify(sensData[key]));
        var sensID = sensData[key].sId;
        if(sensID == TEMP_ID){
          temperature = sensData[key].val;
          console.log("Temperature set to: " + temperature);
        }else if(sensID === (ACC_VE_ID || ACC_LA_ID || ACC_LO_ID)){
          console.log("Acceleration of: " +sensData[key].val);
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
