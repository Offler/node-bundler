
JSResourceRegistry = (function(){
	'use strict';
	
	function JSResourceRegistryConstructor(jsBundleResponseBroker)
	{
		this.resolvedNamespaces = {};
		this.registeredNamespaces = {};
		
		this.resolvedLibraries = {};
		this.registeredLibraries = {};
		
		this.jsBundleResponseBroker = jsBundleResponseBroker;
	}
	
	var JSResourceRegistry = JSResourceRegistryConstructor.prototype;
	
	JSResourceRegistry.registerNamespace = function(namespace, jsNamespaceRoot)
	{
		this.registeredNamespaces[namespace] = jsNamespaceRoot;
	};
	
	JSResourceRegistry.namespaceResolved = function(namespace, jsNamespaceRoot)
	{
		delete this.registeredNamespaces[namespace];
		this.resolvedNamespaces[namespace] = jsNamespaceRoot;
		
		this._ifResourcesResolvedForwardThemToBroker();
	};
	
	JSResourceRegistry.registerLibrary = function(library, jsLibrary)
	{
		this.registeredLibraries[library] = jsLibrary;
	};

	JSResourceRegistry.libraryResolved = function(library, jsLibrary)
	{
		delete this.registeredLibraries[library];
		this.resolvedLibraries[library] = jsLibrary;
		
		this._ifResourcesResolvedForwardThemToBroker();
	};

	JSResourceRegistry.allResourcesRegistered = function()
	{
		this.resourcesRegistered = true;
		
		this._ifResourcesResolvedForwardThemToBroker();
	};

	////////////////////////////////////////
	//		Private methods.
	////////////////////////////////////////

	JSResourceRegistry._ifResourcesResolvedForwardThemToBroker = function()
	{
		if(this._sendResourcesIfResolved())
		{
			for(var library in this.resolvedLibraries)
			{
				var libraryResources = this.resolvedLibraries[library].getLibraryResources();
				
				libraryResources.forEach(function(resource){
					this.jsBundleResponseBroker.jsFileToRead(resource);
				}, this);
			}
		
			for(var namespace in this.resolvedNamespaces)
			{
				var namespaceResources = this.resolvedNamespaces[namespace].getNamespaceResources();
				
				namespaceResources.forEach(function(resource){
					this.jsBundleResponseBroker.jsFileToRead(resource.getFileLocation());
				}, this);
			}
		}
	};

	JSResourceRegistry._sendResourcesIfResolved = function()
	{
		var librariesToResolve = Object.keys(this.registeredLibraries);
		var namespacesToResolve = Object.keys(this.registeredNamespaces);
		
		if(this.resourcesRegistered === true && librariesToResolve.length === 0
		&& namespacesToResolve.length === 0)
		{
			return true;
		}
	};
	
	return JSResourceRegistryConstructor;
})();

exports.JSResourceRegistry = JSResourceRegistry;