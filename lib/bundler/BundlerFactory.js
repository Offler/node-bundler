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
const JSFileReader = require("./filesystem/JSFileReader");
const DirectoryScanner = require("./filesystem/DirectoryScanner");
const JSResourceRegistry = require("./registry/JSResourceRegistry");
const JSBundleRequestHandler = require("./handler/JSBundleRequestHandler");
const StaticFileRequestHandler = require("./handler/StaticFileRequestHandler");
const JSBundleResponseBroker = require("./responsebroker/JSBundleResponseBroker");

const sep = path.sep;
const readdir = fs.readdir;
const readFile = fs.readFile;
const logger = log4js.getLogger( "BundlerFactory" );

function createBundler( config ) {
	logger.debug( "Initializing bundler." );
	
	const requestRouter = createRequestRouter();
	
	logger.debug( "Request router created." );
	
	const bundlerLogger = log4js.getLogger( "Bundler" );
	
	return new Bundler( bundlerLogger, http, requestRouter );
}

function createRequestRouter() {
	const jrh = createJSBundleRequestHandler();
	const srh = createStaticFileRequestHandler();
	const log = log4js.getLogger( "RequestRouter" );
	
	return new RequestRouter( log, jrh, srh );
}

function createJSBundleRequestHandler() {
	const ds = createDirectoryScanner;
	const jrr = createJSResourceRegistry;
	const brb = createJSBundleResponseBroker;
	
	return new JSBundleRequestHandler( ds, jrr, brb );
}

function createStaticFileRequestHandler() {
	const log = log4js.getLogger( "StaticFileRequestHandler" );
	
	return new StaticFileRequestHandler( log, fs.readFile );
}

function createDirectoryScanner( jsResourceRegistry ) {
	const jsl = createJSLibrary;
	const jsn = createJSNamespace();
	const log = log4js.getLogger( "DirectoryScanner" );
	
	return new DirectoryScanner( sep, readdir, log, jsn, jsl, jsResourceRegistry );
}

function createJSResourceRegistry( jsBundleResponseBroker ) {
	return new JSResourceRegistry( jsBundleResponseBroker );
}

function createJSBundleResponseBroker( response ) {
	const log = log4js.getLogger( "JSBundleResponseBroker" );
	
	return new JSBundleResponseBroker( log, createJSFileReader, response );
}

function createJSFileReader( fileName, jsBundleResponseBroker ) {
	return new JSFileReader( readFile, fileName, jsBundleResponseBroker );
}

function createJSNamespace( fileName, sourceSubDir ) {
	return new JSNamespace( sep, readdir, createJSClass, fileName, sourceSubDir );
}

function createJSLibrary( librariesRoot, library ) {
	return new JSLibrary( sep, readdir, librariesRoot, library );
}

function createJSClass() {
	return new JSClass();
}

module.exports = createBundler;
