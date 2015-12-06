//var app = require("../manager.js").getApp(__dirname);  

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

var gcm = require('node-gcm'),
    gcm_message = new gcm.Message(),
    senderGCM = new gcm.Sender('AIzaSyBxwyWeDN6Gj7opmdroPsMVfnaG888WK_A'),
    RETRY_COUNT = 4;

gcm_message.addData('key1', "Test sending.");
gcm_message.delayWhileIdle = true;

function sendGCMMessage(){
  senderGCM.send(gcm_message, registrationIds, RETRY_COUNT, function(err, result) {
      callback(err, result);
  });
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

  var temperature = ["TEMP_ID", 0.0, 0];
  var batteryLevel = ["BATT_ID", 0.0, 0];
  var loc_latitude = ["LOC_LA_ID", 60.449974, 0];
  var loc_longitude = ["LOC_LO_ID", 22.293218, 0];
  var loc_accuracy = ["LOC_AC_ID", .0, 0];
  var cur_speed = ["SPEED_ID", 0.0, 0];
  var impact_data = ["ACC_IMP_ID", 0.0, 0];
  var all_data;
  var top_speed = 21;


  apiServer.connection({
    host: settings.httpHost,
    port: settings.httpPort
  });

  function handleAllData(){
    all_data = 
    {data:
      [ 
      {name: loc_latitude[0], value: loc_latitude[1], ts: loc_latitude[2]},
      {name: loc_longitude[0], value: loc_longitude[1], ts: loc_longitude[2]},
      {name: loc_accuracy[0], value: loc_accuracy[1], ts: loc_accuracy[2]},
      {name: cur_speed[0], value: cur_speed[1], ts: cur_speed[2]},
      {name: impact_data[0], value: impact_data[1], ts: impact_data[2]},
      {name: temperature[0], value: temperature[1], ts: temperature[2]},
      {name: batteryLevel[0], value: batteryLevel[1], ts: batteryLevel[2]}
    ]
    }
  }

  function handleData(data, name){
    writeJSON(name,data);
    console.log("Handling " + name);
  }
  function handleImpact(data, name){
    
    output = {data, loc_latitude, loc_longitude};
    //TODO: update JSON file.
    writeJSON(name, output);
    console.log("Handling impact.");
  }

  function writeJSON(name, data){
      fs.writeFile('www/JSON/'+name+'.json', JSON.stringify(data), {flags: "w"}, function(err){
        if(err){
          return console.log(err);
        }
    })  
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
          temperature = ["TEMP_ID", sensData[key].val, sensData[key].ts];
          console.log("Temperature set to: " + temperature[1]);
        }else if(sensID === (ACC_VE_ID || ACC_LA_ID || ACC_LO_ID)){
          console.log("Acceleration of: " +sensData[key].val);
        }else if (sensID === BATT_ID){
          batteryLevel = ["BATT_ID", sensData[key].val, sensData[key].ts];
          console.log("Battery level is: " + batteryLevel[1]);
        }else if(sensID === ACC_IMP_ID){
          var impactLevel = sensData[key].val;
          impact_data = ["ACC_IMP_ID", impactLevel, sensData[key].ts];
          console.log("WE HAVE IMPACT: " + (impactLevel ? impactLevel : "Something") + " at " + Date(sensData[key].ts));
          //handleImpact(impact_data, "Impact");
        }else if(sensID === LOC_LA_ID){
          loc_latitude = ["LOC_LA_ID", sensData[key].val, sensData[key].ts];
          console.log("Latitude is: " + loc_latitude[1]);
        }else if(sensID === LOC_LO_ID){
          loc_longitude = ["LOC_LO_ID", sensData[key].val, sensData[key].ts];
          console.log("Longitude is: " + loc_longitude[1]);
        }else if(sensID === LOC_AC_ID){
          loc_accuracy = ["LOC_AC_ID", sensData[key].val, sensData[key].ts];
          console.log("Location accuracy: " + loc_accuracy[1]);
        }else if(sensID === SPEED_ID){
          if(sensData[key].val>top_speed){
            top_speed = sensData[key].val;
          }
          cur_speed = ["SPEED_ID", top_speed, sensData[key].ts];
          console.log("Current speed: " + cur_speed[1] + " Top speed: " + top_speed);
        }
      }
      handleAllData();
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
    path: '/speed',
    handler: function(request, reply) {
      var response = "Speed: " + cur_speed[1] + " m/s";

      reply(response);
    }
  });

  apiServer.route({
    method: 'GET',
    path: '/battery',
    handler: function(request, reply) {
      var response = "Battery lvl: " + batteryLevel[1] + "%";

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
      console.log(request);
      reply();
    }
  });

  apiServer.route({
    method: 'GET',
    path: '/android/deliverLocation',
    handler: function(request, reply){
      reply({Lat: loc_latitude[1], Long: loc_longitude[1]});
    }
  });

  apiServer.route({
    method: 'GET',
    path: '/android/deliverAllData',
    handler: function(request, reply){
      reply(all_data);
    }
  });


  apiServer.start(function() {
    console.log('APIServer running at:', apiServer.info.uri);
    //TESTS
    //writeJSON("apina", [{"a":"b"}])
    sendGCMMessage;
  });


}

startAPI(settings);
//Tests

