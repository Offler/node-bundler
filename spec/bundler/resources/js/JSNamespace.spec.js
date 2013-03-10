var fs = require('fs');

var JSNamespace = require('../../../../lib/bundler/resources/js/JSNamespace');
var JSResourceRegistry = require('../../../../lib/bundler/registry/JSResourceRegistry');

describe('A JSNamespace', function(){
	'use strict';
	
	var jsNamespace = {};
	var childJSNamespace = {};
	var jsNamespaceParent = {};
	var secondChildJSNamespace = {};
	
	beforeEach(function(){
		spyOn(fs, 'readdir');
		
		JSNamespace.injectDependencies(fs, {sep: '/'}, {});
		jsNamespace = new JSNamespace('org', 'src/org');
		
		jsNamespaceParent = JSResourceRegistry.prototype;
		
		spyOn(jsNamespaceParent, 'namespaceResolved');
		
		childJSNamespace = new JSNamespace('subpackage', 'src/org/subpackage');
		secondChildJSNamespace = new JSNamespace('anothersub', 'src/org/anothersub');
	});
	
	it('will resolve child namespaces.', function(){
		//Given.
		
		//Doing.
		jsNamespace.resolveNamespace(jsNamespaceParent);
		
		//Should.
		expect(fs.readdir).toHaveBeenCalledWith('src/org', jasmine.any(Function));
	});

	it('will ask child namespace objects to resolve.', function(){
		//Given.
		
		//Doing.
		jsNamespace.namespaceDirRead({}, ['subpackage', 'anothersub']);
		
		//Should.
		expect(fs.readdir).toHaveBeenCalledWith('src/org/subpackage', jasmine.any(Function));
		expect(fs.readdir).toHaveBeenCalledWith('src/org/anothersub', jasmine.any(Function));
	});

	it('will notify parent namespace once all child namespaces are resolved.', function(){
		//Given.
		jsNamespace.resolveNamespace(jsNamespaceParent);
		jsNamespace.namespaceDirRead({}, ['subpackage', 'anothersub']);
		
		//Doing.
		jsNamespace.namespaceResolved('subpackage', childJSNamespace);
		jsNamespace.namespaceResolved('anothersub', secondChildJSNamespace);
		
		//Should.
		expect(jsNamespaceParent.namespaceResolved).toHaveBeenCalledWith('org', jsNamespace);
	});
	
	it('will return a namespace object literal for itself.', function(){
		//Given.
		jsNamespace.resolveNamespace(jsNamespaceParent);
			//And.
		jsNamespace.namespaceDirRead({}, ['subpackage', 'anothersub']);
			//And.
		jsNamespace.namespaceResolved('subpackage', childJSNamespace);
		spyOn(childJSNamespace, 'getNamespaceObjectLiteral').andCallFake(function(namespaceObjLiteral){namespaceObjLiteral.subsub = {};});
			//And.
		jsNamespace.namespaceResolved('anothersub', secondChildJSNamespace);
		spyOn(secondChildJSNamespace, 'getNamespaceObjectLiteral');
		
		//Doing.
		var namespaceObjectLiteral = {};
		jsNamespace.getNamespaceObjectLiteral(namespaceObjectLiteral);
		
		//Should.
		expect(JSON.stringify(namespaceObjectLiteral)).toEqual('{"subpackage":{"subsub":{}},"anothersub":{}}');
	});
});