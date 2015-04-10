var cluster = require('cluster');
var http = require('http');
var https = require('https');
var web = require('./app/web.js');
var count = require('os').cpus().length;
var config = require('./config.js');

/*
if(!process.env.NO_CLUSTER && cluster.isMaster) {
	for(var i = 0; i < count; i++) {
		cluster.fork();
	}
	cluster.on('exit', function() {
		console.log('Worker died. Spawning a new process...');
		cluster.fork();
	});
}
else {*/

var port = process.env.PORT || config.webport;
if(config.ssl) {
	// OpsWorks configuration
	var fs = require('fs');
	var credentials = {
		key: fs.readFileSync(__dirname + '/../../shared/config/ssl.key', 'utf8'),
		cert: fs.readFileSync(__dirname + '/../../shared/config/ssl.crt', 'utf8'),
		ca: fs.readFileSync(__dirname + '/../../shared/config/ssl.ca', 'utf8').split('\n\n')
	};
	var httpsServer = https.createServer(credentials, web);
	httpsServer.listen(port, null, function() {
		console.log('HTTPS server started: https://localhost');
	});
	port = 80;
}
var httpServer = http.createServer(web);
httpServer.listen(port, null, function() {
	console.log('HTTP server started: http://localhost:' + port);
});


