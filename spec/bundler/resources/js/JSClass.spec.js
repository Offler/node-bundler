var JSClass = require('../../../../lib/bundler/resources/js/JSClass').JSClass;

describe('A JSClass', function(){
	'use strict';
	
	it('will return the file location it was constructed with', function(){
		
		var jsClass = new JSClass('TestClass.js', 'bundler/test/TestClass.js');
		
		expect(jsClass.getFileLocation()).toEqual('bundler/test/TestClass.js');
	});
});