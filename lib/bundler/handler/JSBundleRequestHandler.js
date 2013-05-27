
var JSBundleRequestHandler = (function(){
	'use strict';
	
	function JSBundleRequestHandlerConstructor( directorScanner, jsResourceRegistry, jsBundleResponseBroker )
	{
		this.directoryScanner = directorScanner;
		this.jsResourceRegistry = jsResourceRegistry;
		this.jsBundleResponseBroker = jsBundleResponseBroker;
	}
	
	var JSBundleRequestHandler = JSBundleRequestHandlerConstructor.prototype;
	
	JSBundleRequestHandler.consumeRequest = function(response)
	{
		var jsBundleResponseBroker = this.jsBundleResponseBroker( response );
		var jsResourceRegistry = this.jsResourceRegistry( jsBundleResponseBroker );
		var directoryScanner = this.directoryScanner( jsResourceRegistry );

		directoryScanner.scanSource('src');
		directoryScanner.scanLibraries('lib');
	};
	
	return JSBundleRequestHandlerConstructor;
})();

module.exports = JSBundleRequestHandler;