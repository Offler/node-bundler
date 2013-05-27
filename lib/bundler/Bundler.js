var log4js = require('log4js');

var Bundler = (function(){
	'use strict';
	
	var http = {};
	var port = 1337;
	var requestRouter = {};
	var hostname = '127.0.0.1';
	var logger = log4js.getLogger('Bundler');
	
	function Bundler(httpModule, requestRouters)
	{
		http = httpModule;
		requestRouter = requestRouters;
	}
	
	Bundler.prototype.startBundlerServer = function()
	{
		var serverRequestCallback = requestRouter.consumeRequest.bind(requestRouter);
		var server = http.createServer(serverRequestCallback);
		
		server.listen(port, hostname);

		logger.debug('Server running at %s:%d', hostname, port);
	};
	
	return Bundler;
})();

module.exports = Bundler;