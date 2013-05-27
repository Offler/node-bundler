
var RequestRouter = (function(){
	'use strict';
	
	function RequestRouterConstructor( logger, jSBundleRequestHandler, staticFileRequestHandler )
	{
		this.logger = logger;
		this.jsBundleRequestHandler = jSBundleRequestHandler;
		this.staticFileRequestHandler = staticFileRequestHandler;
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
		this.logger.debug('Request method [%s], url [%s]', request.method, request.url);
		
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

module.exports = RequestRouter;