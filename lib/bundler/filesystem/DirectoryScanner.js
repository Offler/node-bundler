var fs = require('fs');
var path = require('path');

var Logger = require('../Logger');
var JSLibrary = require('../resources/js/JSLibrary.js').JSLibrary;
var JSNamespace = require('../resources/js/JSNamespace.js');

DirectoryScanner = (function(){
    'use strict';
    
    function DirectoryScannerConstructor(jsResourceRegistry)
    {
		this.registeredSource = {};
		this.registeredLibrary = {};
		
		this.jsResourceRegistry = jsResourceRegistry;
	}

	var DirectoryScanner = DirectoryScannerConstructor.prototype;
	
	DirectoryScanner.scanSource = function(srcRoot)
	{
		this.registeredSource[srcRoot] = true;
		
		fs.readdir(srcRoot, this.sourceDirRead.bind(this, srcRoot));
	};

	DirectoryScanner.scanLibraries = function(librariesRoot)
	{
		this.registeredLibrary[librariesRoot] = true;
		
		fs.readdir(librariesRoot, this.librariesDirRead.bind(this, librariesRoot));
	};

	DirectoryScanner.sourceDirRead = function(sourceDir, error, files)
	{
		for(var file = 0; file < files.length; file++)
		{
			var fileName = files[file];
			var sourceSubDir = sourceDir + path.sep + fileName;
			
			var jsNamespaceRoot = new JSNamespace(fileName, sourceSubDir);
			
			this.jsResourceRegistry.registerNamespace(fileName, jsNamespaceRoot);
			
			jsNamespaceRoot.resolveNamespace(this.jsResourceRegistry);
		}
		
		delete this.registeredSource[sourceDir];
		
		this._ifAllRegisteredDirectoriesScannedAllowRegistryToProceed();
	};

	DirectoryScanner.librariesDirRead = function(librariesRoot, error, files)
	{
		if(error)
		{
			Logger.logError('Error while trying to read the libraries directory (%s).', error, [librariesRoot]);
		}
		else
		{
			for(var file = 0; file < files.length; file++)
			{
				var library = files[file];
				var jsLibrary = new JSLibrary(librariesRoot, library);

				jsLibrary.resolveLibrary(this.jsResourceRegistry);
			}
		}
	
		delete this.registeredLibrary[librariesRoot];
		
		this._ifAllRegisteredDirectoriesScannedAllowRegistryToProceed();
	};

	////////////////////////////////////////
	//		Private methods.
	////////////////////////////////////////

	DirectoryScanner._ifAllRegisteredDirectoriesScannedAllowRegistryToProceed = function()
	{
		var sourceDirToResolve = Object.keys(this.registeredSource);
		var librariesToResolve = Object.keys(this.registeredLibrary);
		
		if(sourceDirToResolve.length === 0 && librariesToResolve.length === 0)
		{
			this.jsResourceRegistry.allResourcesRegistered();
		}
	};

    return DirectoryScannerConstructor;
})();

exports.DirectoryScanner = DirectoryScanner;