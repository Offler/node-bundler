
Logger = (function(){
	'use strict';
	
	function Logger(){};
	
	/**
	 * 
	 * @param {String} message
	 * @param {type} error
	 * @param {Array} data
	 * @returns {undefined}
	 */
	Logger.logError = function(message, error, data)
	{
		Array.isArray(data) ? data.unshift(message) : data = [message];
		var currentDate = new Date().toISOString();
		
		console.error('**********************************');
		console.error.apply(console, data);
		console.error(currentDate, error);
		console.error(currentDate, error.stack);
		console.error('**********************************');
	};

	Logger.log = function(message, data)
	{
		var currentDate = new Date().toISOString();
		message = currentDate + ' ' + message;
		Array.isArray(data) ? data.unshift(message) : data = [message];
		
		console.log.apply(console, data);
	};

	return Logger;
})();

module.exports = Logger;