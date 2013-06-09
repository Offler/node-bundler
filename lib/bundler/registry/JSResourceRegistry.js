"use strict";

function JSResourceRegistry( jsBundleResponseBroker ) {
	this.resolvedNamespaces = {};
	this.registeredNamespaces = {};
	
	this.resolvedLibraries = {};
	this.registeredLibraries = {};
	
	this.jsBundleResponseBroker = jsBundleResponseBroker;
}

JSResourceRegistry.prototype.registerNamespace = function( namespace, jsNamespaceRoot ) {
	this.registeredNamespaces[namespace] = jsNamespaceRoot;
};

JSResourceRegistry.prototype.namespaceResolved = function( namespace, jsNamespaceRoot ) {
	delete this.registeredNamespaces[namespace];
	this.resolvedNamespaces[namespace] = jsNamespaceRoot;
	
	this._writeOutNamespaceObjectLiteral( namespace, jsNamespaceRoot );
	this._ifResourcesResolvedForwardThemToBroker();
};

JSResourceRegistry.prototype.registerLibrary = function( library, jsLibrary ) {
	this.registeredLibraries[library] = jsLibrary;
};

JSResourceRegistry.prototype.libraryResolved = function( library, jsLibrary ) {
	delete this.registeredLibraries[library];
	this.resolvedLibraries[library] = jsLibrary;
	
	this._ifResourcesResolvedForwardThemToBroker();
};

JSResourceRegistry.prototype.allResourcesRegistered = function() {
	this.resourcesRegistered = true;
	
	this._ifResourcesResolvedForwardThemToBroker();
};

////////////////////////////////////////
//		Private methods.
////////////////////////////////////////

JSResourceRegistry.prototype._ifResourcesResolvedForwardThemToBroker = function() {
	if( this._sendResourcesIfResolved() ) {		
		for(var library in this.resolvedLibraries) {
			var libraryResources = this.resolvedLibraries[library].getLibraryResources();
			
			libraryResources.forEach( giveJSFileToResponseBroker, this);
		}
		
		for(var namespace in this.resolvedNamespaces) {
			var namespaceResources = this.resolvedNamespaces[namespace].getNamespaceResources();
			
			namespaceResources.forEach( giveJSFileLocationToResponseBroker, this);
		}
	}
};

JSResourceRegistry.prototype._sendResourcesIfResolved = function() {
	var librariesToResolve = Object.keys(this.registeredLibraries);
	var namespacesToResolve = Object.keys(this.registeredNamespaces);
	
	if( this.resourcesRegistered === true && librariesToResolve.length === 0 && namespacesToResolve.length === 0 ) {
		return true;
	}
};

JSResourceRegistry.prototype._writeOutNamespaceObjectLiteral = function( namespace, jsNamespace ) {
	var namespaceObjectLiteral = {};
	
	jsNamespace.getNamespaceObjectLiteral( namespaceObjectLiteral );
	
	var namespaceObjectLiteralString = namespace + " = " + JSON.stringify( namespaceObjectLiteral );
	
	this.jsBundleResponseBroker.writeNamespaceObjectLiteral( namespaceObjectLiteralString );
};

function giveJSFileToResponseBroker( resource ) {
	this.jsBundleResponseBroker.jsFileToRead( resource );
}

function giveJSFileLocationToResponseBroker( resource ) {
	this.jsBundleResponseBroker.jsFileToRead( resource.getFileLocation() );
}

module.exports = JSResourceRegistry;
