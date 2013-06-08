"use strict";

function DirectoryScanner( sep, readdir, logger, jsNamespace, jsLibrary, jsResourceRegistry ) {
	this.registeredSource = {};
	this.registeredLibrary = {};
	
	this.sep = sep;
	this.logger = logger;
	this.readdir = readdir;
	this.jsLibrary = jsLibrary;
	this.jsNamespace = jsNamespace;
	this.jsResourceRegistry = jsResourceRegistry;
}

DirectoryScanner.prototype.scanSource = function( srcRoot ) {
	this.registeredSource[srcRoot] = true;
	
	this.readdir( srcRoot, this.sourceDirRead.bind(this, srcRoot) );
	
	this.logger.info( "Scanning source directory [%s]", srcRoot );
};

DirectoryScanner.prototype.scanLibraries = function(librariesRoot) {
	this.registeredLibrary[librariesRoot] = true;
	
	this.readdir( librariesRoot, this.librariesDirRead.bind(this, librariesRoot) );
	
	this.logger.info( "Scanning library directory [%s]", librariesRoot );
};

DirectoryScanner.prototype.sourceDirRead = function(sourceDir, error, files) {
	if( error ) {
		this.logger.error( "Source directory read failed [%s].", sourceDir, error );
	} else {
		this.logger.info( "Source directory read [%s]", sourceDir );
		
		for( let file = 0; file < files.length; file++ ) {
			const fileName = files[file];
			const sourceSubDir = sourceDir + this.sep + fileName;
			const jsNamespaceRoot = this.jsNamespace( fileName, sourceSubDir );
			
			this.jsResourceRegistry.registerNamespace( fileName, jsNamespaceRoot );
			
			jsNamespaceRoot.resolveNamespace( this.jsResourceRegistry );
		}
	}
	
	delete this.registeredSource[sourceDir];
	
	this._ifAllRegisteredDirectoriesScannedAllowRegistryToProceed();
};

DirectoryScanner.prototype.librariesDirRead = function(librariesRoot, error, files)
{
	if(error) {
		this.logger.error( "Libraries directory read failed [%s].", librariesRoot, error );
	} else {
		this.logger.info( "Libraries directory read [%s]", librariesRoot );
		
		for( let file = 0; file < files.length; file++ ) {
			const library = files[file];
			const jsLibrary = this.jsLibrary( librariesRoot, library );
			
			jsLibrary.resolveLibrary( this.jsResourceRegistry );
		}
	}
	
	delete this.registeredLibrary[librariesRoot];
	
	this._ifAllRegisteredDirectoriesScannedAllowRegistryToProceed();
};

////////////////////////////////////////
//		Private methods.
////////////////////////////////////////

DirectoryScanner.prototype._ifAllRegisteredDirectoriesScannedAllowRegistryToProceed = function() {
	const sourceDirToResolve = Object.keys( this.registeredSource );
	const librariesToResolve = Object.keys( this.registeredLibrary );
	
	if( sourceDirToResolve.length === 0 && librariesToResolve.length === 0 ) {
		this.jsResourceRegistry.allResourcesRegistered();
	}
};

module.exports = DirectoryScanner;
