var Hapi = require('hapi');
var fs = require('fs');
var path = require('path');
// var Inert = require('inert');
var apiServer = new Hapi.Server();

var settings = {
    httpPort: process.env.PORT,
    apiPath: '/api/post',
    // httpHost: '0.0.0.0'
}



function startAPI(settings) {
  console.log("Seeing if this even gets called.");

  var LOC_LA_ID = "0x00010100";
  var LOC_LO_ID = "0x00010200";
  var LOC_AC_ID = "0x00010400";
  var SPEED_ID = "0x00020100";
  var ACC_IMP_ID = "0x00050400";
  var TEMP_ID = "0x00060100";
  var BATT_ID = "0x00030200";

  //Not in use on thingsee side:
  var ACC_LO_ID = "0x00050100";
  var ACC_LA_ID = "0x00050200";
  var ACC_VE_ID = "0x00050300";


  var temperature = ["TEMP_ID",0.0,0];
  var batteryLevel = ["BATT_ID",0.0,0];
  var loc_latitude = ["LOC_LA_ID",0.0,0];
  var loc_longitude = ["LOC_LO_ID",0.0,0];
  var loc_accuracy = ["LOC_AC_ID",0.0,0];
  var cur_speed = ["SPEED_ID",0.0,0];
  var impact_data = ["ACC_IMP_ID",0.0,0];


  apiServer.connection({
    host: settings.httpHost,
    port: settings.httpPort
  });

  function handleData(data, name){
    writeJSON(name,data);
    console.log("Handling " + name);
  }
  function handleImpact(data, name){
    //TODO: update JSON file.
    writeJSON(name, data);
    console.log("Handling impact.");
  }

  function writeJSON(name, data){
    if(!fs.exists('www/JSON/'+name+'.json')){
      console.log("Something.")
      fs.writeFile('www/JSON/'+name+'.json', JSON.stringify(data), {flags: "w"}, function(err){
        if(err){
          return console.log(err);
        }
      });
    }
  }

  function handleNotify(settings, device){
    console.log("Notification from phone.");
  }

  //HTTP requests for data handling and visualization.
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
      for(var key in sensData){
        console.log("sensor value: " + JSON.stringify(sensData[key]));
        var sensID = sensData[key].sId;
        if(sensID == TEMP_ID){
          temperature = ["TEMP_ID",sensData[key].val,sensData[key].ts];
          console.log("Temperature set to: " + temperature[1]);
        }else if(sensID === (ACC_VE_ID || ACC_LA_ID || ACC_LO_ID)){
          console.log("Acceleration of: " +sensData[key].val);
        }else if (sensID === BATT_ID){
          batteryLevel = ["BATT_ID",sensData[key].val,sensData[key].ts];
          console.log("Battery level is: " + batteryLevel[1]);
        }else if(sensID === ACC_IMP_ID){
          var impactLevel = sensData[key].val;
          impact_data = ["ACC_IMP_ID",impactLevel,sensData[key].ts];
          console.log("WE HAVE IMPACT: " + (impactLevel ? impactLevel : "Something") + " at " + Date(sensData[key].ts));
          //handleImpact(impact_data);
        }else if(sensID === LOC_LA_ID){
          loc_latitude = ["LOC_LA_ID",sensData[key].val,sensData[key].ts];
          console.log("Latitude is: " + loc_latitude[1]);
        }else if(sensID === LOC_LO_ID){
          loc_longitude = ["LOC_LO_ID",sensData[key].val,sensData[key].ts];
          console.log("Longitude is: " + loc_longitude[1]);
        }else if(sensID === LOC_AC_ID){
          loc_accuracy = ["LOC_AC_ID",sensData[key].val,sensData[key].ts];
          console.log("Location accuracy: " + loc_accuracy[1]);
        }else if(sensID === SPEED_ID){
          cur_speed = ["SPEED_ID",sensData[key].val,sensData[key].ts];
          console.log("Current speed: " + cur_speed[1]);
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
      var response = "Temperature: " + temperature[1] + "C";

      reply(response);
    }
  });

  apiServer.route({
    method: 'GET',
    path: '/home',
    handler: function(request, reply){
      reply.file('www/index.html');
    }
  });

  //HTTP requests for the android side.
  apiServer.route({
    method: 'POST',
    path: '/android/notifyServer',
    handler: function(request, reply){
      handleNotify(1,5);
      reply();
    }
  });

  apiServer.route({
    method: 'GET',
    path: '/android/deliverLocation',
    handler: function(request, reply){
      reply();
    }
  });

  apiServer.route({
    method: 'GET',
    path: '/android/deliverAllData',
    handler: function(request, reply){
      reply();
    }
  });


  apiServer.start(function() {
    console.log('APIServer running at:', apiServer.info.uri);
    //TESTS
    //writeJSON("apina", [{"a":"b"}])
  });


}

startAPI(settings);
//Tests

