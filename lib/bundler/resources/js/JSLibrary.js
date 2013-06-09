"use strict";

function JSLibrary( sep, readdir, librariesRoot, library ) {
	this.sep = sep;
	this.readdir = readdir;
	this.library = library;
	this.librariesRoot = librariesRoot;
}

JSLibrary.prototype.resolveLibrary = function( jsResourceRegistry ) {
	this.jsResourceRegistry = jsResourceRegistry;
	this.jsResourceRegistry.registerLibrary( this.library, this );
	
	const libraryPath = this.librariesRoot + this.sep + this.library;
	this.readdir( libraryPath, this.libraryDirRead.bind(this) );
};

JSLibrary.prototype.libraryDirRead = function( error, files ) {
	this.libraryFiles = files;
	
	this.jsResourceRegistry.libraryResolved( this.library, this );
};

JSLibrary.prototype.getLibraryResources = function() {
	const libraryResources = [];
	
	this.libraryFiles.forEach( addJSResourcesToFileArray, this );
	
	return libraryResources;
	
	function addJSResourcesToFileArray( fileName ) {
		if( fileName.match(/^.*\.js$/i) ) {
			const resourceName = this.librariesRoot + this.sep + this.library + this.sep + fileName;
			libraryResources.push( resourceName );
		}
	}
};

module.exports = JSLibrary;
