var express = require('express');
var app = express({
	'env': 'production'
});
var compression = require('compression');
//var serveStatic = require('serve-static');
var config = require('../config.js');

// Configure ejs engine
app.set('views', __dirname + '/../views');
app.engine('html', require('ejs').renderFile);

// Force HTTPS on stackedit.io
app.all('*', function(req, res, next) {
	if (req.headers.host == 'stackedit.io' && !req.secure && req.headers['x-forwarded-proto'] != 'https') {
		return res.redirect('https://stackedit.io' + req.url);
	}
	/\.(eot|ttf|woff|svg)$/.test(req.url) && res.header('Access-Control-Allow-Origin', '*');
	next();
});

// Use gzip compression
if (config.compress) {
	app.use(compression());
}

app.post('/pdfExport', require('./pdf').export);
app.post('/sshPublish', require('./ssh').publish);
app.post('/picasaImportImg', require('./picasa').importImg);
app.get('/downloadImport', require('./download').importPublic);



// Serve static resources
app.use(express.static(__dirname + '/../public', {
	'maxAge': 3153600000
}));

if (config.browserCache && (config.debug || config.debuggable)) {
	app.use(function (req, res, next) {
		res.render = function (page) {
			return res.render(page, {
				cache: !(req.query.hasOwnProperty('debug') || config.debug)
			});
		};
		next();
	});
}

// Serve landing.html in /
app.get('/', function(req, res) {
	res.render('landing.html');
});

// Serve editor.html in /viewer
app.get('/editor', function(req, res) {
	res.render('editor.html');
});

// Serve viewer.html in /viewer
app.get('/viewer', function(req, res) {
	res.render('viewer.html');
});

// Error 404
app.use(function(req, res) {
	res.status(404);
	res.render('error_404.html');
});

module.exports = app;
