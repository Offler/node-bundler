"use strict";

function JSFileReader( readFile, fileName, jsBundleResponseBroker ) {
	this.fileName = fileName;
	this.jsBundleResponseBroker = jsBundleResponseBroker;
	
	readFile( fileName, "utf-8", this.readFileHandler.bind(this) );
}

JSFileReader.prototype.readFileHandler = function( error, data ) {
	this.jsBundleResponseBroker.jsFileRead( this.fileName, data );
};

module.exports = JSFileReader;
