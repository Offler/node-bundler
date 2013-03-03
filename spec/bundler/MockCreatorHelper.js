
MockCreatorHelper = (function(){
	'use strict';
	
	function MockCreatorHelper(){}
	
	var classproto = MockCreatorHelper.prototype;
	
	/**
	 * http://nodejs.org/api/http.html#http_class_http_serverrequest
	 * 
	 * @param {type} url
	 * @param {type} method
	 * @returns {http.ServerRequest}
	 */
	classproto.createServerRequest = function(url, method)
	{
		return {
			'url': url,
			'method': method
		};
	};

	/**
	 * http://nodejs.org/api/http.html#http_class_http_serverresponse
	 * 
	 * @returns {http.ServerResponse}
	 */
	classproto.createServerResponse = function()
	{
		return {};
	};
	
	return MockCreatorHelper;
})();