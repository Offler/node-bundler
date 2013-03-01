var JSFileReader = require('../filesystem/JSFileReader.js').JSFileReader;

JSBundleResponseBroker = (function(){
	'use strict';
	
	function JSBundleResponseBrokerConstructor(serverResponse)
	{
		this.outstandingJSFiles = {};
		this.serverResponse = serverResponse;
		
		serverResponse.writeHead(200, { 'Content-Type': 'application/javascript' });
	}
	
	var JSBundleResponseBroker = JSBundleResponseBrokerConstructor.prototype;
	
	JSBundleResponseBroker.jsFileToRead = function(fileName)
	{
		this.outstandingJSFiles[fileName] = new JSFileReader(fileName, this);
	};	
	
	JSBundleResponseBroker.jsFileRead = function(fileName, fileData)
	{
		this.serverResponse.write(fileData);
		delete this.outstandingJSFiles[fileName];
		
		this._endResponseIfAllJSFilesAreSent();
	};

	////////////////////////////////////////
	//		Private methods.
	////////////////////////////////////////

	JSBundleResponseBroker._endResponseIfAllJSFilesAreSent = function()
	{
		var filesStillOutstanding = Object.keys(this.outstandingJSFiles);
		
		if(filesStillOutstanding.length === 0)
		{
			this.serverResponse.end();
		}
	};
	
	return JSBundleResponseBrokerConstructor;
})();

exports.JSBundleResponseBroker = JSBundleResponseBroker;