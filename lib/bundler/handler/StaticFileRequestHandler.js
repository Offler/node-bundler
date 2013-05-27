
var StaticFileRequestHandler = (function(){
	'use strict';
	
	var mimes = {
		'css' : 'text/css',
		'js' : 'text/javascript',
		'htm' : 'text/html',
		'html' : 'text/html',
		'ico' : 'image/vnd.microsoft.icon'
    };
	
	function StaticFileRequestHandlerConstructor( logger, readFile )
	{
		this.logger = logger;
		this.readFile = readFile;
	}
	
	var StaticFileRequestHandler = StaticFileRequestHandlerConstructor.prototype;
	
	StaticFileRequestHandler.consumeRequest = function(response, url)
	{
		url = '.' + (url === '/' ? '/index.html' : url);
		
		this.readFile(url, this.fileHandler.bind(this, response, url));
	};

    StaticFileRequestHandler.fileHandler = function(response, url, error, content)
    {
        if (error)
        {
            this.logger.error('error loading file %s', url, error);
			
            response.writeHead(404);
            response.end();
        }
        else
        {
			// Lookup the mimetype of the file
			var tmp     = url.lastIndexOf('.');
			var ext     = url.substring((tmp + 1));
			var mime    = mimes[ext] || 'text/plain';
			// Write the file
			response.writeHead(200, { 'Content-Type': mime });
			response.end(content, 'utf-8');
        }
    };
	
	return StaticFileRequestHandlerConstructor;
})();

module.exports = StaticFileRequestHandler;