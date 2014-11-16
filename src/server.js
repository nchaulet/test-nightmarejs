var express = require('express'),
	jade = require('jade');

var Server = function(model) {

	
	var app = express()

	app.set('views', './views');
	app.set('view engine', 'jade'),
	app.engine('jade', jade.__express);

	app.use(express.static('static'));
	
	app.get('/', function (req, res) {
		 res.render('index', {
		 	products: model.products
		 });
	});

	app.get('/crawl', function(req, res) {
		model.refresh();

		res.status(204).end();
	});

	server = app.listen(3000);
}


module.exports = Server;