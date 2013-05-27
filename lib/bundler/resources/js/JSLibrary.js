
var JSLibrary = (function(){
	'use strict';
	
	function JSLibraryConstructor( sep, readdir, librariesRoot, library )
	{
		this.sep = sep;
		this.readdir = readdir;
		this.library = library;
		this.librariesRoot = librariesRoot;
	}
	
	var JSLibrary = JSLibraryConstructor.prototype;
	
	JSLibrary.resolveLibrary = function(jsResourceRegistry)
	{
		this.jsResourceRegistry = jsResourceRegistry;
		
		this.jsResourceRegistry.registerLibrary(this.library, this);
		
		var libraryPath = this.librariesRoot + this.sep + this.library;
		this.readdir(libraryPath, this.libraryDirRead.bind(this));
	};

	JSLibrary.libraryDirRead = function(error, files)
	{
		this.libraryFiles = files;
		
		this.jsResourceRegistry.libraryResolved(this.library, this);
	};

	JSLibrary.getLibraryResources = function()
	{
		var libraryResources = [];
		
		this.libraryFiles.forEach(addJSResourcesToFileArray, this);
		
		return libraryResources;
		
		function addJSResourcesToFileArray(fileName)
		{
			if(fileName.match(/^.*\.js$/i))
			{
				var resourceName = this.librariesRoot + this.sep + this.library + this.sep + fileName;
				libraryResources.push( resourceName );
			}
		}
	};
	
	return JSLibraryConstructor;
})();

module.exports = JSLibrary;