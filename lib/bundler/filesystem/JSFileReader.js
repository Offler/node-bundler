var fs = require('fs');

JSFileReader = (function(){
	'use strict';
	
	function JSFileReaderConstructor(fileName, jsBundleResponseBroker)
	{
		this.fileName = fileName;
		this.jsBundleResponseBroker = jsBundleResponseBroker;
		
		fs.readFile(fileName, 'utf-8', this.readFileHandler.bind(this));
	}
	
	var JSFileReader = JSFileReaderConstructor.prototype;
	
	/**
	 * 
	 * @param {type} error
	 * @param {type} data
	 * @returns {undefined}
	 */
	JSFileReader.readFileHandler = function(error, data)
	{
		this.jsBundleResponseBroker.jsFileRead(this.fileName, data);
	};

	return JSFileReaderConstructor;
})();

exports.JSFileReader = JSFileReader;