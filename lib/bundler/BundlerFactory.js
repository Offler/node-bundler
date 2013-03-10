var fs = require('fs');
var path = require('path');
var http = require('http');

var Bundler = require('./Bundler');
var JSClass = require('./resources/js/JSClass.js');
var RequestRouter = require('./router/RequestRouter');
var JSNamespace = require('./resources/js/JSNamespace.js');

BundlerFactory = (function(){
	'use strict';
	
	function BundlerFactory(){};
	
	//You probably want to configure the src, lib directories, 
	//if you should write to disk or not.
	//what port to connect to. What hostname.
	//If you should transliterate from ES6 to ES5.
	BundlerFactory.createBundler = function(config)
	{
		this._injectDependencies();
		
		var requestRouter = new RequestRouter();
		
		return new Bundler(http, requestRouter);
	};

	BundlerFactory._injectDependencies = function()
	{
		JSNamespace.injectDependencies(fs, path, JSClass);
	};
	
	return BundlerFactory;
})();

module.exports = BundlerFactory;