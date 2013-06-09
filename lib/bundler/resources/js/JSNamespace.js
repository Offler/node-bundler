"use strict";

function JSNamespace( sep, readdir, jsClass, namespace, namespaceDir ) {
	this.sep = sep;
	this.readdir = readdir;
	this.jsClass = jsClass;
	this.namespace = namespace;
	this.namespaceDir = namespaceDir;
	
	this.resolvedChildNamespace = {};
	this.registeredChildNamespace = new Map();
	
	this.jsClasses = [];
}

JSNamespace.prototype.resolveNamespace = function( jsNamespaceParent ) {
	this.jsNamespaceParent = jsNamespaceParent;
	
	this.readdir( this.namespaceDir, this.namespaceDirRead.bind(this) );
};

JSNamespace.prototype.namespaceDirRead = function( error, files ) {
	for( let file = 0; file < files.length; file++ ) {
		const fileName = files[file];
		
		if( fileName.match(/^.*\.js$/i) ) {
			const className = this.namespaceDir + this.sep + fileName;
			const jsClass = this.jsClass( fileName, className );
			
			this.jsClasses.push( jsClass );
		} else {
			const sourceSubDir = this.namespaceDir + this.sep + fileName;
			const jsNamespace = new JSNamespace( this.sep, this.readdir, this.jsClass, fileName, sourceSubDir );
			
			jsNamespace.resolveNamespace(this);
			
			this.registeredChildNamespace.set( fileName, jsNamespace );
		}
	}
	
	this._resolveNamespaceIfChildNamespacesAreResolved();
};

JSNamespace.prototype.namespaceResolved = function( namespace, jsNamespace ) {
	this.registeredChildNamespace.delete( namespace );
	
	this.resolvedChildNamespace[namespace] = jsNamespace;
	
	this._resolveNamespaceIfChildNamespacesAreResolved();
};

JSNamespace.prototype.getNamespaceObjectLiteral = function( namespaceObject ) {
	for( let namespace in this.resolvedChildNamespace ) {
		const childNamespaceObject = {};
		const childNamespace = this.resolvedChildNamespace[namespace];
		namespaceObject[namespace] = childNamespaceObject;
		
		childNamespace.getNamespaceObjectLiteral( childNamespaceObject );
	}
};

JSNamespace.prototype.getNamespaceResources = function() {
	let resources = this.jsClasses.slice(0);
	
	for( let namespace in this.resolvedChildNamespace ) {
		const jsNamespace = this.resolvedChildNamespace[namespace];
		resources = resources.concat( jsNamespace.getNamespaceResources() );
	}
	
	return resources;
};

////////////////////////////////////////
//		Private methods.
///////////////////////////////////////

JSNamespace.prototype._resolveNamespaceIfChildNamespacesAreResolved = function() {
	if( this.registeredChildNamespace.size === 0 ) {
		this.jsNamespaceParent.namespaceResolved( this.namespace, this );
	}
};

module.exports = JSNamespace;
