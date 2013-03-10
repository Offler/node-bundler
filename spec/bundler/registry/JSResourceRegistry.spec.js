var JSNamespace = require('../../../lib/bundler/resources/js/JSNamespace');
var JSResourceRegistry = require('../../../lib/bundler/registry/JSResourceRegistry');
var JSBundleResponseBroker = require('../../../lib/bundler/responsebroker/JSBundleResponseBroker');

describe('A JSResourceRegistry', function(){
	'use strict';
	
	var jsNamespace = {};
	var jsResourceRegistry = {};
	var jsBundleResponseBroker = {};
	
	beforeEach(function(){
		jsNamespace = JSNamespace.prototype;
		jsBundleResponseBroker = JSBundleResponseBroker.prototype;
		
		jsResourceRegistry = new JSResourceRegistry(jsBundleResponseBroker);
	});
	
	it('will request and write a namespace object literal when a namespace is resolved.', function(){
		//Given.
		var namespaceJSON = 'org = {"subnamespace":{},"namespace":{}}';
		jsResourceRegistry.registerNamespace('org', jsNamespace);
		spyOn(jsNamespace, 'getNamespaceObjectLiteral').andCallFake(
				function(namespaceObjLiteral){
					namespaceObjLiteral.subnamespace = {};
					namespaceObjLiteral.namespace = {};});
		spyOn(jsBundleResponseBroker, 'writeNamespaceObjectLiteral');
		
		//Doing.
		jsResourceRegistry.namespaceResolved('org', jsNamespace);
		
		//Should.
		expect(jsNamespace.getNamespaceObjectLiteral).toHaveBeenCalledWith(jasmine.any(Object));
		expect(jsBundleResponseBroker.writeNamespaceObjectLiteral).toHaveBeenCalledWith(namespaceJSON);
	});
});