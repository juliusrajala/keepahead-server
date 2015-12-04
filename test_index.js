var Hapi = require('hapi');
var apiServer = new Hapi.Server();

var settings = {
    httpPort: process.env.PORT,
    apiPath: '/api/post',
    // httpHost: '0.0.0.0'
}


function startAPI(settings) {
  console.log("Seeing if this even gets called.");

  apiServer.connection({
    host: settings.httpHost,
    port: settings.httpPort
  });

  apiServer.route({
    method: 'POST',
    path: settings.apiPath,
    handler: function(request, reply) {
      var dId = request.headers.deviceauthuuid ? request.headers.deviceauthuuid : 'unknown';
      console.log('Received POST data: device' + dId);
	  //Do something with the data from a Thingsee One
	  // console.log( request.payload );
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
  apiServer.start(function() {
    console.log('APIServer running at:', apiServer.info.uri);
  });
}

startAPI(settings);
