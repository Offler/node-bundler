
JSClass = (function(){
	'use strict';
	
	//className actually ends with '.js', do we want file name or class name?
	function JSClassConstructor(className, fileLocation)
	{
		this.className = className;
		this.fileLocation = fileLocation;
	}

	var JSClass = JSClassConstructor.prototype;
	
	JSClass.getFileLocation = function()
	{
		return this.fileLocation;
	};
	
	return JSClassConstructor;
})();

module.exports = JSClass;