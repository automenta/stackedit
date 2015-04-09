//Server configuration
module.exports = {
	browserCache: false,
	compress: false, //for transmitting client content
	debuggable: false,
	debug: false,
	production: false //false = development mode, true = production mode (with optimizations applied to client in require.js build)
};
