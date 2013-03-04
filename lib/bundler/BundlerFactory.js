var http = require('http');

var Bundler = require('./Bundler');
var RequestRouter = require('./router/RequestRouter');

BundlerFactory = (function(){
	'use strict';
	
	function BundlerFactory(){};
	
	//You probably want to configure the src, lib directories, 
	//if you should write to disk or not.
	//what port to connect to. What hostname.
	//If you should transliterate from ES6 to ES5.
	BundlerFactory.createBundler = function(config)
	{
		var requestRouter = new RequestRouter();
		
		return new Bundler(http, requestRouter);
	};
	
	return BundlerFactory;
})();

module.exports = BundlerFactory;