
var DirectoryScanner = (function(){
    'use strict';
    
    function DirectoryScannerConstructor( sep, readdir, logger, jsNamespace, jsLibrary, jsResourceRegistry )
    {
		this.registeredSource = {};
		this.registeredLibrary = {};
		
		this.sep = sep;
		this.logger = logger;
		this.readdir = readdir;
		this.jsLibrary = jsLibrary;
		this.jsNamespace = jsNamespace;
		this.jsResourceRegistry = jsResourceRegistry;
	}

	var DirectoryScanner = DirectoryScannerConstructor.prototype;
	
	DirectoryScanner.scanSource = function(srcRoot)
	{
		this.registeredSource[srcRoot] = true;
		
		this.readdir(srcRoot, this.sourceDirRead.bind(this, srcRoot));
		
		this.logger.info( 'Scanning source directory, %s', srcRoot );
	};

	DirectoryScanner.scanLibraries = function(librariesRoot)
	{
		this.registeredLibrary[librariesRoot] = true;
		
		this.readdir(librariesRoot, this.librariesDirRead.bind(this, librariesRoot));
		
		this.logger.info( 'Scanning library directory [%s]', librariesRoot );
	};

	DirectoryScanner.sourceDirRead = function(sourceDir, error, files)
	{
		if( error )
		{
			this.logger.error( 'Source directory read failed [%s].', sourceDir, error );
		}
		else
		{
			this.logger.info( 'Source directory read [%s]', sourceDir );
			
			for(var file = 0; file < files.length; file++)
			{
				var fileName = files[file];
				var sourceSubDir = sourceDir + this.sep + fileName;
				
				var jsNamespaceRoot = this.jsNamespace(fileName, sourceSubDir);
				
				this.jsResourceRegistry.registerNamespace(fileName, jsNamespaceRoot);
				
				jsNamespaceRoot.resolveNamespace(this.jsResourceRegistry);
			}
		}
		
		delete this.registeredSource[sourceDir];
		
		this._ifAllRegisteredDirectoriesScannedAllowRegistryToProceed();
	};

	DirectoryScanner.librariesDirRead = function(librariesRoot, error, files)
	{
		if(error)
		{
			this.logger.error( 'Libraries directory read failed [%s].', librariesRoot, error );
		}
		else
		{
			this.logger.info( 'Libraries directory read [%s]', librariesRoot );
			
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

module.exports = DirectoryScanner;