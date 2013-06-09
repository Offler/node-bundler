"use strict";

var mimes = {
	"css" : "text/css",
	"htm" : "text/html",
	"html" : "text/html",
	"js" : "text/javascript",
	"ico" : "image/vnd.microsoft.icon"
};

function StaticFileRequestHandler( logger, readFile ) {
	this.logger = logger;
	this.readFile = readFile;
}

StaticFileRequestHandler.prototype.consumeRequest = function( response, url ) {
	url = "." + (url === "/" ? "/index.html" : url);
	
	this.readFile( url, this.fileHandler.bind(this, response, url) );
};

StaticFileRequestHandler.prototype.fileHandler = function( response, url, error, content ) {
	if (error) {
		this.logger.error( "error loading file %s", url, error );
		
		response.writeHead(404);
		response.end();
	} else {
		const tmp     = url.lastIndexOf(".");
		const ext     = url.substring((tmp + 1));
		const mime    = mimes[ext] || "text/plain";
		
		response.writeHead( 200, { "Content-Type": mime } );
		response.end( content, "utf-8" );
	}
};

module.exports = StaticFileRequestHandler;
