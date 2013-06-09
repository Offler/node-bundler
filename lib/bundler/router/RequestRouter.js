"use strict";

function RequestRouter( logger, jSBundleRequestHandler, staticFileRequestHandler ) {
	this.logger = logger;
	this.jsBundleRequestHandler = jSBundleRequestHandler;
	this.staticFileRequestHandler = staticFileRequestHandler;
}

RequestRouter.prototype.consumeRequest = function( request, response ) {
	this.logger.debug( "Request method [%s], url [%s]", request.method, request.url );
	
	if ( request.method === "GET" ) {
		if( request.url === "/bundle.js" ) {
			this.jsBundleRequestHandler.consumeRequest( response );
        } else {
			this.staticFileRequestHandler.consumeRequest( response, request.url );
        }
    }
};

module.exports = RequestRouter;