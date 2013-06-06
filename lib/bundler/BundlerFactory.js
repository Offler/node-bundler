"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const log4js = require("log4js");

const Bundler = require("./Bundler");
const JSClass = require("./resources/js/JSClass");
const JSLibrary = require("./resources/js/JSLibrary");
const RequestRouter = require("./router/RequestRouter");
const JSNamespace = require("./resources/js/JSNamespace");
const DirectoryScanner = require("./filesystem/DirectoryScanner");
const JSResourceRegistry = require("./registry/JSResourceRegistry");
const JSBundleRequestHandler = require("./handler/JSBundleRequestHandler");
const StaticFileRequestHandler = require("./handler/StaticFileRequestHandler");
const JSBundleResponseBroker = require("./responsebroker/JSBundleResponseBroker");

const sep = path.sep;
const readdir = fs.readdir;
const logger = log4js.getLogger( "BundlerFactory" );

function createBundler( config ) {
	logger.debug( "Initializing bundler." );
	
	var jrh = createJSBundleRequestHandler();
	var srh = createStaticFileRequestHandler();
	var log = log4js.getLogger( "RequestRouter" );
	
	var requestRouter = new RequestRouter( log, jrh, srh );
	
	logger.debug( "Request router created." );
	
	return new Bundler(http, requestRouter);
}

function createJSBundleRequestHandler() {
	var ds = createDirectoryScanner;
	var jrr = createJSResourceRegistry;
	var brb = createJSBundleResponseBroker;
	
	return new JSBundleRequestHandler( ds, jrr, brb );
}

function createStaticFileRequestHandler() {
	var log = log4js.getLogger( "StaticFileRequestHandler" );
	
	return new StaticFileRequestHandler( log, fs.readFile );
}

function createDirectoryScanner( jsResourceRegistry ) {
	var jsl = createJSLibrary;
	var jsn = createJSNamespace();
	var log = log4js.getLogger( "DirectoryScanner" );
	
	return new DirectoryScanner( sep, readdir, log, jsn, jsl, jsResourceRegistry );
}

function createJSResourceRegistry( jsBundleResponseBroker ) {
	return new JSResourceRegistry( jsBundleResponseBroker );
}

function createJSBundleResponseBroker( response ) {
	return new JSBundleResponseBroker( response );
}

function createJSNamespace( fileName, sourceSubDir ) {
	return new JSNamespace( fileName, sourceSubDir, sep, readdir, createJSClass );
}

function createJSLibrary( librariesRoot, library ) {
	return new JSLibrary( sep, readdir, librariesRoot, library );
}

function createJSClass() {
	return new JSClass();
}

module.exports = createBundler;
