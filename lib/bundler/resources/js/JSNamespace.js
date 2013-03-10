
JSNamespace = (function(){
	'use strict';
	
	var fs = {};
	var path = {};
	var JSClass = {};
	
	function JSNamespaceConstructor(namespace, namespaceDir)
	{
		this.namespace = namespace;
		this.namespaceDir = namespaceDir;
		
		this.resolvedChildNamespace = {};
		this.registeredChildNamespace = {};
		
		this.jsClasses = [];
	}
	
	JSNamespaceConstructor.injectDependencies = function(FS, PATH, JSCLASS)
	{
		fs = FS, path = PATH, JSClass = JSCLASS;
	};

	var JSNamespace = JSNamespaceConstructor.prototype;

	JSNamespace.resolveNamespace = function(jsNamespaceParent)
	{
		this.jsNamespaceParent = jsNamespaceParent;
		
		fs.readdir(this.namespaceDir, this.namespaceDirRead.bind(this));
	};
	
	JSNamespace.namespaceDirRead = function(error, files)
	{
		for(var file = 0; file < files.length; file++)
		{
			var fileName = files[file];
			
			if(fileName.match(/^.*\.js$/i))
			{
				this.jsClasses.push(new JSClass(fileName, this.namespaceDir + path.sep + fileName));
			}
			else
			{
				var sourceSubDir = this.namespaceDir + path.sep + fileName;
				var jsNamespace = new JSNamespaceConstructor(fileName, sourceSubDir);
				
				jsNamespace.resolveNamespace(this);
				
				this.registeredChildNamespace[fileName] = jsNamespace;
			}
		}
		
		this._resolveNamespaceIfChildNamespacesAreResolved();
	};

	JSNamespace.namespaceResolved = function(namespace, jsNamespace)
	{
		delete this.registeredChildNamespace[namespace];
		
		this.resolvedChildNamespace[namespace] = jsNamespace;
		
		this._resolveNamespaceIfChildNamespacesAreResolved();
	};

	JSNamespace.getNamespaceResources = function()
	{
		var resources = this.jsClasses.slice(0);
		
		for(var namespace in this.resolvedChildNamespace)
		{
			var jsNamespace = this.resolvedChildNamespace[namespace];
			resources = resources.concat(jsNamespace.getNamespaceResources());
		}
	
		return resources;
	};

	////////////////////////////////////////
	//		Private methods.
	///////////////////////////////////////
	
	JSNamespace._resolveNamespaceIfChildNamespacesAreResolved = function()
	{
		var unresolvedChildNamespaces = Object.keys(this.registeredChildNamespace);
		
		if(unresolvedChildNamespaces.length === 0)
		{
			this.jsNamespaceParent.namespaceResolved(this.namespace, this);
		}
	};
	
	return JSNamespaceConstructor;
})();

module.exports = JSNamespace;