var fs = require('fs');
var path = require('path');
var http = require('http');
var log4js = require('log4js');

var Bundler = require('./Bundler');
var JSClass = require('./resources/js/JSClass');
var RequestRouter = require('./router/RequestRouter');
var JSLibrary = require('./resources/js/JSLibrary.js');
var JSNamespace = require('./resources/js/JSNamespace');
var DirectoryScanner = require('./filesystem/DirectoryScanner');
var JSResourceRegistry = require('./registry/JSResourceRegistry.js');
var JSBundleRequestHandler = require('./handler/JSBundleRequestHandler');
var StaticFileRequestHandler = require('./handler/StaticFileRequestHandler');
var JSBundleResponseBroker = require('./responsebroker/JSBundleResponseBroker.js');

var BundlerFactory = (function(){
	'use strict';
	
	var sep = path.sep;
	var readdir = fs.readdir;

	var logger = log4js.getLogger('BundlerFactory');
	
	function BundlerFactory(){}
	var p = BundlerFactory;
	
	//You probably want to configure the src, lib directories, if you should write to disk or not.
	//what port to connect to. What hostname. If you should transliterate from ES6 to ES5.
	p.createBundler = function( config )
	{
		logger.debug("Initializing bundler.");
		
		var log = log4js.getLogger( 'RequestRouter' );
		var jrh = this.createJSBundleRequestHandler();
		var srh = this.createStaticFileRequestHandler();
		
		var requestRouter = new RequestRouter( log, jrh, srh );
		
		logger.debug("Request router created.");
		
		return new Bundler(http, requestRouter);
	};
	
	p.createJSBundleRequestHandler = function()
	{
		var ds = this.createDirectoryScanner.bind( this );
		var jrr = this.createJSResourceRegistry.bind( this );
		var brb = this.createJSBundleResponseBroker.bind( this );
		
		return new JSBundleRequestHandler( ds, jrr, brb );
	};
	
	p.createStaticFileRequestHandler = function()
	{
		var log = log4js.getLogger( 'StaticFileRequestHandler' );
		
		return new StaticFileRequestHandler( log, fs.readFile );
	};
	
	p.createDirectoryScanner = function( jsResourceRegistry )
	{
		var jsn = this.createJSNamespace.bind( this );
		var log = log4js.getLogger('DirectoryScanner');
		
		return new DirectoryScanner( sep, readdir, log, jsn, jsResourceRegistry );
	};
	
	p.createJSResourceRegistry = function( jsBundleResponseBroker )
	{
		return new JSResourceRegistry( jsBundleResponseBroker );
	};
	
	p.createJSBundleResponseBroker = function( response )
	{
		return new JSBundleResponseBroker( response );
	};
	
	p.createJSNamespace = function( fileName, sourceSubDir )
	{
		return new JSNamespace( fileName, sourceSubDir, sep, readdir, this.createJSClass );
	};
	
	p.createJSLibrary = function(librariesRoot, library )
	{
		
		return new JSLibrary( sep, readdir, librariesRoot, library);
	};
	
	p.createJSClass = function()
	{
		
	};
	
	return BundlerFactory;
})();

module.exports = BundlerFactory;