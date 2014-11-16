var Model = function(crawler) {

	this.crawler = crawler;
	this.crawlLock = false;
	this.products = [];
	this.refresh();
};

Model.prototype.refresh = function() {

	if (this.crawlLock) {
		return;
	}
	this.crawlLock = true;

	var _this = this;
		this.crawler.crawl('http://www.twenga.fr/theiere.html', 10)
		.then(function(result) {
			_this.products = result;
			_this.crawlLock = false;
		}, function(err) {
			_this.crawlLock = false;
			console.log(err);
		});
};

module.exports = Model;