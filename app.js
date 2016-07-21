'use strict';
var appname = 'My Awesome Microapp';

var express = require('express');
//var rp = require('request-promise');
var errors = require('request-promise/errors');
var serveStatic = require('serve-static');
var proxy = require('express-request-proxy');
var debug = require('debug')('app');
var app = express();
var router = express.Router();

var endPoints ={};
var assetPath;
var userPath;
var vcap;

if(process.env.VCAP_SERVICES){
  vcap= JSON.parse(process.env.VCAP_SERVICES);
}


if(vcap){
  var userProvided = vcap["user-provided"];
  if(userProvided){
    userProvided.forEach(function (arrayItem){
      endPoints[arrayItem.name] = arrayItem.credentials.uri;
    });
  }
}

if(endPoints && endPoints["apm-ext-service-demo"]){
  assetPath = endPoints["apm-ext-service-demo"];
  console.log("APM_EXT_SERVICE_BASE_URL is being read from VCAP_SERVICES");
} else {
  console.log("APM_EXT_SERVICE_BASE_URL is not set");
  assetPath = "https://apm-ext-service-demo.run.asv-pr.ice.predix.io/v1";
  //assetPath = "http://localhost:8080/v1";
}

//app.use(serveStatic('public'));
function setCacheControl(res, path) {
    res.setHeader('Cache-Control', 'public, max-age=604800');
}
app.use('/', serveStatic('public', {
	setHeaders: setCacheControl
}));


app.use('/api/*', (req, res, next) => {
  proxy({
    url: assetPath + '/*',
    timeout: parseInt(req.headers.timeout) || 3600000
  })(req, res, next);
});

app.use(function (req, res, next) {
  console.log('page not found - request url', req.hostname + ':' + port + req.originalUrl);
  res.render('not-found.html');
});

app.use(function (err, req, res, next) {
  console.log('error - request url', req.hostname + ':' + port + req.originalUrl);
  console.error('err', err);
  res.render('error.html');
});

// Need to let CF set the port if we're deploying there.
var port = process.env.PORT || 9000;
app.listen(port);
console.log(appname + ' started on port ' + port);