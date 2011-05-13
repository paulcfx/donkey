
/**
 * Module dependencies.
 */

var express = require('express');
var sys     = require('sys');
var app = module.exports = express.createServer();
var Counter = require('./models/counter');
var Article = Counter.Article;

var util = require('util');
//var Solr = require('./models/solr');
//var SolrQ = Solr.Q;

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});


app.configure('production', function(){
  app.use(express.errorHandler()); 
});

//show search page
app.get('/search', function(req, res) {
	res.render('search', {title: 'Search Now!'});
});	

app.post('/search', function(req, res) {
	var ss = req.param('ss', null);
	var solr = require('solr');
	var client = solr.createClient();
	var responseObject= {message: 'No results found!'};

	client.query(ss, function(err, data) {
	 	responseObject = JSON.parse(data);
		//console.log(Q);
		res.render('showResults', {
			title: 'Showing results for: ' + ss,
			results: responseObject
		});
	});
});
//the view
app.get('/articles', function(req, res) {
	Article.find({}, function(err, docs) {
		res.render('article', {
			title: 'List of articles',
			articles: docs
		});
	});
});

// New article
app.get('/articles/new', function(req, res){
  res.render('new', {
    title: 'New Article'
  });
});

// View an article
app.get('/article/:id', function(req, res){
  Article.findOne({_id:req.params.id}, function(err,article){
    res.render('show', {
      title: article.doc.title,
      article: article.doc
    });
  });
});


// Create/Update articles
app.post('/articles', function(req, res){
  if(req.body.article._id)
    Article.findOne({_id:req.body.article._id}, function(err, a) {
      a.title = req.body.article.title;
      a.body = req.body.article.body;
      a.save(function(err) {
        console.log(err);
      })
    });
  else {
    article = new Article(req.body.article);
    article.save(function(err){
      console.log("Created");
    });
  }

  res.redirect('/articles');

});

app.get('/count', function(req, resp) {
	/*
	Counter.count(function(num_records) {
		if(num_records > 0) {
			var c = new Counter();
			c.num = 0;
			c.save(function() {
				res.render('count', {locals: {count: c.num}});
			})
		} else {
			Counter.find().last(function(c) {
				c.num += 1;
				c.save(function() {
					res.render('count', {locals: {count: c.num}});
				});
			});
		}
	});
	*/
});

app.get('/', function(req, res){
  res.render('index', {
		title: 'EricM rocks',
		title1: 'Brian rocks too!'
	});
	//var bl = util.inspect(req._events, false, 2);
	//console.log(bl);
});

app.get('/about', function(req, res){
	res.render('about', {title: 'About Us'});
});

app.get('/contact', function(req, res) {
	res.render('contact', {title: 'You can contact me via:'});
});

app.get('/login', function(req, res) {
	var user = {email: "paulcfx@gmail.com"};
	res.render('login', {title: 'Please Login:'});
});

app.post('/login', function(req, res) {
	var password = req.param('password', null);
	if(password && password == 'letmein'){
		res.redirect('about');
	} else {
		res.redirect('login');
	}
	
});

// Only listen on $ node app.js
if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
