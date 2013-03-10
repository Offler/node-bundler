var JsMockito = require('jsmockito').JsMockito;

var JSBundleResponseBroker = require('../../../lib/bundler/responsebroker/JSBundleResponseBroker');

describe('A JSBundleResponseBroker', function(){
	'use strict';
	
	JsMockito.Integration.Nodeunit();
	
	var serverResponse = {};
	var jsBundleResponseBroker = {};
	
	beforeEach(function(){
		var mockCreatorHelper = new MockCreatorHelper();
		
		serverResponse = mock(mockCreatorHelper.createServerResponse());
		
		jsBundleResponseBroker = new JSBundleResponseBroker(serverResponse);
	});
	
	it('will write the namespace object literal when given it.', function(){
		//Given.
		var namespaceObjectLiteral = 'toplevel = {subpackage : {}, secondsubpackage : {}};';
		
		//Doing.
		jsBundleResponseBroker.writeNamespaceObjectLiteral(namespaceObjectLiteral);
		
		//Should.
		verify(serverResponse).write(namespaceObjectLiteral);
	});
});