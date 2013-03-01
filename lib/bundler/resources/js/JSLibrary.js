var fs = require('fs');
var path = require('path');

JSLibrary = (function(){
	'use strict';
	
	function JSLibraryConstructor(librariesRoot, library)
	{
		this.librariesRoot = librariesRoot;
		this.library = library;
	}
	
	var JSLibrary = JSLibraryConstructor.prototype;
	
	JSLibrary.resolveLibrary = function(jsResourceRegistry)
	{
		this.jsResourceRegistry = jsResourceRegistry;
		
		this.jsResourceRegistry.registerLibrary(this.library, this);
		
		var libraryPath = this.librariesRoot + path.sep + this.library;
		fs.readdir(libraryPath, this.libraryDirRead.bind(this));
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
				libraryResources.push(this.librariesRoot + path.sep + 
						this.library + path.sep + fileName);
			}
		};
	};
	
	return JSLibraryConstructor;
})();

exports.JSLibrary = JSLibrary;