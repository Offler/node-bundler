"use strict";

const port = 1337;
const hostname = "127.0.0.1";

function Bundler( log, httpModule, requestRouters ) {
	this.logger = log;
	this.http = httpModule;
	this.requestRouter = requestRouters;
}

Bundler.prototype.startBundlerServer = function() {
	const serverRequestCallback = this.requestRouter.consumeRequest.bind( this.requestRouter );
	const server = this.http.createServer( serverRequestCallback );
	
	server.listen( port, hostname );
	
	this.logger.debug( "Server running at %s:%d", hostname, port );
};

module.exports = Bundler;
