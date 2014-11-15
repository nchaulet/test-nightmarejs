var TwengaCrawler = require('./crawler');

var crawler = new TwengaCrawler({
	webSecurity: false,
	// proxy: '80.248.212.35:3128',
	// proxyType: 'http'
});

var products = [];

var crawlLock = true;

crawler.crawl('http://www.twenga.fr/theiere.html')
	.then(function(result) {
		products = result;
		crawlLock = false;
	}, function(err) {
		crawlLock = false;
		console.log(err);
	});


var express = require('express')
var app = express()

app.set('views', './views');
app.set('view engine', 'jade'),
app.engine('jade', require('jade').__express);

app.get('/', function (req, res) {
	 res.render('index', {
	 	products: products
	 });
});


app.get('/crawl', function(req, res) {
	if (crawlLock) {
		return res.status(500).end();
	}

	crawlLock = true;

	crawler.crawl('http://www.twenga.fr/theiere.html')
	.then(function(result) {
		products = result;
		crawlLock = false;
	}, function(err) {
		crawlLock = false;
		console.log(err);
	});

	res.status(204).end();
});

app.get('/articles.json', function(req, res) {
	res.send(products);
});

var server = app.listen(3000);
