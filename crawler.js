
var Nightmare = require('nightmare'),
 Q = require('q');

var TwengaCrawler = function(nightmareOptions) {
	this.nightmareOptions = nightmareOptions;
};

TwengaCrawler.prototype.crawl = function(url) {
	var deferred = Q.defer();

	var _this = this;

	var products = [];

	new Nightmare()
		.viewport(1200, 4000)
		.useragent('Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36')
  		.goto(url)
	  	.evaluate(function() {
	  		window.twengaUrl = [];
	  		window.twengaProducts = [];

	  		window.open = function(url) {
	  			twengaUrl = url;
	  		};

	  		var productsElements =  document.querySelectorAll('#result li');
	  		for (var i = 0; i < 10 ;i++) {
	  			$(productsElements[i].querySelector('.btnG')).click();	

	  			window.twengaProducts.push({
	  				url: twengaUrl,
	  				title: productsElements[i].querySelector('.clr9').innerText,
	  				price: productsElements[i].querySelector('.price').innerText,
	  				stock: productsElements[i].querySelector('.itDetails').innerText.search('En stock') >= 0 ? true : false
	  			});
	  		}

	  		return twengaProducts;
	  	}, function(twengaProducts) {
	  		products = twengaProducts;
	  	})
	  	.run(function (err, nightmare) {
	      if (err) return deferred.reject(err);

	      var promises = products.map(function(product) {
	      	return _this.crawlProductUrl(product);
	      });

	      Q.all(promises).then(function() {
	      	deferred.resolve(products);
	      }, deferred.reject);

	    });

	return deferred.promise;
};

TwengaCrawler.prototype.crawlProductUrl = function(product) {
	var deferred = Q.defer();
	
	new Nightmare(this.nightmareOptions)
		.useragent('Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36')
	  	.goto(product.url)
	  	.wait(7000)
	  	// @TODO captcha OCR or human based api
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