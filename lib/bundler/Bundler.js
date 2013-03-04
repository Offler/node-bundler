var Logger = require('./Logger');

Bundler = (function(){
	'use strict';
	
	var http = {};
	var port = 1337;
	var hostname = '127.0.0.1';
	var requestRouter = {};
	
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

		Logger.log('Server running at %s:%d', [hostname, port]);
	};
	
	return Bundler;
})();

module.exports = Bundler;