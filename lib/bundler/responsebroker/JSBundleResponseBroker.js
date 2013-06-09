"use strict";

function JSBundleResponseBroker( logger, jsFileReader, serverResponse ) {
	this.logger = logger;
	this.jsFileReader = jsFileReader;
	this.outstandingJSFiles = new Map();
	this.serverResponse = serverResponse;
	
	serverResponse.writeHead( 200, { "Content-Type": "application/javascript" } );
	
	this.logger.debug( "Header written to response." );
}

JSBundleResponseBroker.prototype.writeNamespaceObjectLiteral = function( namespaceObjectLiteral ) {
	this.serverResponse.write( namespaceObjectLiteral + ";\n" );
	
	this.logger.debug( "Namespace object literal written to response." );
};

JSBundleResponseBroker.prototype.jsFileToRead = function( fileName ) {
	this.outstandingJSFiles.set( fileName, this.jsFileReader( fileName, this ) );
};	

JSBundleResponseBroker.prototype.jsFileRead = function( fileName, fileData ) {
	this.serverResponse.write( fileData );
	this.outstandingJSFiles.delete( fileName );
	
	this.logger.debug( "File [%s] written to response.", fileName );
	
	this._endResponseIfAllJSFilesAreSent();
};

////////////////////////////////////////
//		Private methods.
////////////////////////////////////////

JSBundleResponseBroker.prototype._endResponseIfAllJSFilesAreSent = function() {
	if( this.outstandingJSFiles.size === 0 ) {
		this.serverResponse.end();
		
		this.logger.debug( "Server response closed." );
	}
};

module.exports = JSBundleResponseBroker;
