
var Nightmare = require('nightmare'),
 Q = require('q');

/**
* Twenga crawler
*/
var TwengaCrawler = function(nightmareOptions) {
	this.nightmareOptions = nightmareOptions;

};

TwengaCrawler.PAGE_ELEMENT = {
	RESULT_ELEMENTS: '#result li',
	SHOP_LINK: '.btnG',
	TITLE: '.clr9',
	PRICE: '.price',
	STOCK: '.itDetails',
	PHOTO: '.photo img'
};

/**
* Crawl a twenga page and retrieve <number> product
*/
TwengaCrawler.prototype.crawl = function(url, number) {
	var deferred = Q.defer();

	var _this = this;

	var products = [];

	this.urlCrawlTimeout = 0;

	new Nightmare()
		.viewport(1200, 4000)
		.useragent('Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36')
  		.goto(url)
	  	.evaluate(function(options, PAGE_ELEMENT) {

	  		window.twengaUrl = [];
	  		window.twengaProducts = [];

	  		window.open = function(url) {
	  			twengaUrl = url;
	  		};

	  		var productsElements =  document.querySelectorAll('#result li');
	  		for (var i = options.offset; i < options.number ;i++) {
	  			$(productsElements[i].querySelector(PAGE_ELEMENT.SHOP_LINK)).click();	

	  			window.twengaProducts.push({
	  				url: twengaUrl,
	  				title: productsElements[i].querySelector(PAGE_ELEMENT.TITLE).innerText,
	  				price: productsElements[i].querySelector(PAGE_ELEMENT.PRICE).innerText,
	  				stock: productsElements[i].querySelector(PAGE_ELEMENT.STOCK).innerText.search('En stock') >= 0 ? true : false,
	  				photo: productsElements[i].querySelector(PAGE_ELEMENT.PHOTO).getAttribute('src')
	  			});
	  		}

	  		return twengaProducts;
	  	}, function(twengaProducts) {
	  		products = twengaProducts;
	  	}, {
	  		offset: 0,
	  		number: number
	  	}, TwengaCrawler.PAGE_ELEMENT)
	  	.screenshot('./static/crawlresult.jpg')
	  	.run(function (err, nightmare) {
	      if (err) return deferred.reject(err);

	      var urlCrawlTimeout =  10000;

	      var promises = products.map(function(product) {
	      	// Crawl with a 30 second interval to avoid captcha
	      	urlCrawlTimeout += 30 * 1000;

	      	return _this._crawlProductUrl(product, urlCrawlTimeout);
	      });

	      Q.all(promises).then(function() {
	      	deferred.resolve(products);
	      }, deferred.reject);

	    });

	return deferred.promise;
};

/**
* Retrieve shop url for a product
*/
TwengaCrawler.prototype._crawlProductUrl = function(product, startTimeout) {
	var deferred = Q.defer();
	
	new Nightmare(this.nightmareOptions)
	.useragent('Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36')
	.wait(startTimeout)
  	.goto(product.url)
  	.wait(20000)
  	.url(function(url) {
  		product.url = url;
  		deferred.resolve(product);
  	})
  	.run(function (err, nightmare) {
  		if (err) return deferred.reject(err);
  	});
	
	return deferred.promise;
};

module.exports = TwengaCrawler;