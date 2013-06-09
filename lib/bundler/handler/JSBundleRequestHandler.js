"use strict";

function JSBundleRequestHandler( directorScanner, jsResourceRegistry, jsBundleResponseBroker ) {
	this.directoryScanner = directorScanner;
	this.jsResourceRegistry = jsResourceRegistry;
	this.jsBundleResponseBroker = jsBundleResponseBroker;
}

JSBundleRequestHandler.prototype.consumeRequest = function( response ) {
	const jsBundleResponseBroker = this.jsBundleResponseBroker( response );
	const jsResourceRegistry = this.jsResourceRegistry( jsBundleResponseBroker );
	const directoryScanner = this.directoryScanner( jsResourceRegistry );
	
	directoryScanner.scanSource( "src" );
	directoryScanner.scanLibraries( "lib" );
};

module.exports = JSBundleRequestHandler;
