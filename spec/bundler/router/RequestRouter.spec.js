var JsMockito = require('jsmockito').JsMockito;
var proxyquire = require('proxyquire');

var JSBundleRequestHandler = require('../../../lib/bundler/handler/JSBundleRequestHandler');

describe('A RequestRouter', function(){
	'use strict';
	
	var requestRouter = {};
	var mockCreatorHelper = {};
	var jsBundleRequestHandler = {};
	
	JsMockito.Integration.Nodeunit();
	
	beforeEach(function(){
		function returnMock()
		{
			return jsBundleRequestHandler;
		};
	
		jsBundleRequestHandler = mock(JSBundleRequestHandler);
		
		var mockedRequires = { '../handler/JSBundleRequestHandler': returnMock };
		var RequestRouter = proxyquire('../../../lib/bundler/router/RequestRouter', mockedRequires);
		
		requestRouter = new RequestRouter();
		mockCreatorHelper = new MockCreatorHelper();
	});
	
	it('will send a bundle.js GET request to the JSBundleRequestHandler.', function(){
		//Given.
		var serverRequest = mockCreatorHelper.createServerRequest('/bundle.js', 'GET');
		var serverResponse = mockCreatorHelper.createServerResponse();
		
		//Doing.
		requestRouter.consumeRequest(serverRequest, serverResponse);
		
		//Should.
		verify(jsBundleRequestHandler).consumeRequest(serverResponse);
	});
	
});