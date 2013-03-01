var DirectoryScanner = require('../filesystem/DirectoryScanner.js').DirectoryScanner;
var JSResourceRegistry = require('../registry/JSResourceRegistry.js').JSResourceRegistry;
var JSBundleResponseBroker = require('../responsebroker/JSBundleResponseBroker.js').JSBundleResponseBroker;

JSBundleRequestHandler = (function(){
	'use strict';
	
	function JSBundleRequestHandlerConstructor(){}
	
	var JSBundleRequestHandler = JSBundleRequestHandlerConstructor.prototype;
	
	JSBundleRequestHandler.consumeRequest = function(response)
	{
		var jsBundleResponseBroker = new JSBundleResponseBroker(response);
		var jsResourceRegistry = new JSResourceRegistry(jsBundleResponseBroker);
		var directoryScanner = new DirectoryScanner(jsResourceRegistry);

		directoryScanner.scanSource('src');
		directoryScanner.scanLibraries('lib');
	};
	
	return JSBundleRequestHandlerConstructor;
})();

exports.JSBundleRequestHandler = JSBundleRequestHandler;