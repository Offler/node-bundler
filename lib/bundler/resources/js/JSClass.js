"use strict";

//className actually ends with '.js', do we want file name or class name?
function JSClass( className, fileLocation ) {
	this.className = className;
	this.fileLocation = fileLocation;
}

JSClass.prototype.getFileLocation = function() {
	return this.fileLocation;
};

module.exports = JSClass;
