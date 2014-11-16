var TwengaCrawler = require('./src/crawler'),
	Model 		  = require('./src/model'),
	Server 		  = require('./src/server');

var crawler = new TwengaCrawler({
	webSecurity: false,
});

var model = new Model(crawler);

var server = new Server(model);
