var JSBundleRequestHandler = require('../handler/JSBundleRequestHandler.js').JSBundleRequestHandler;
var StaticFileRequestHandler = require('../handler/StaticFileRequestHandler.js').StaticFileRequestHandler;

RequestRouter = (function(){
	'use strict';
	
	function RequestRouterConstructor()
	{
		this.jsBundleRequestHandler = new JSBundleRequestHandler();
		this.staticFileRequestHandler = new StaticFileRequestHandler();
	}
	
	var RequestRouter = RequestRouterConstructor.prototype;
	
	/**
	 * 
	 * @param {type} request
	 * @param {type} response
	 * @returns {undefined}
	 */
	RequestRouter.consumeRequest = function(request, response)
	{
		console.log(new Date() + ' [' + request.method + '] ' + request.url);
		
		if (request.method === 'GET')
        {
			if(request.url === '/bundle.js')
            {
				this.jsBundleRequestHandler.consumeRequest(response);
            }
            else
            {
				this.staticFileRequestHandler.consumeRequest(response, request.url);
            }
        }
	};
	
	return RequestRouterConstructor;
})();

exports.RequestRouter = RequestRouter;