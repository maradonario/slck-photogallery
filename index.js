var express = require('express');
var app = express();
var credentials = require('./credentials.js');
var PAGESIZE = 12;
var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: credentials.flickr.key,
      secret: credentials.flickr.secret,
      callback : "http://localhost:3000/cb"
    };

// set up handle bars
var handlebars = require('express-handlebars').create({ 
    defaultLayout : 'main',
    helpers : {
        section : function(name, options) {
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        },
        inc : function(value, options)
        {
            return parseInt(value) + 1;
        },
        dec : function(value, options)
        {
            return parseInt(value) - 1;
        },
        ifNotLast : function(value, options) {
            if (Number(value) === PAGESIZE - 1)  {
                console.log('last one: ' + value);
                return options.inverse(this);
            }
            console.log('not last ' + value);
            return options.fn(this);
        }
    }
});


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// set port
app.set('port', process.env.PORT || 3000);

// static content
app.use(express.static(__dirname + '/public'));

// body-parser
app.use(require('body-parser').urlencoded({extended : true}));
// home page
app.get('/', function(req, res) {
  
    res.render('home');

});

app.post('/submitJS', function(req, res) {
    console.log(req.body.searchTerm);
    res.render('ajax', { layout : null});
});

// gallery
app.get('/gallery', function(req, res){
    
    var searchTerm = '';
    var page = '';
    if (req.query.currentSearchTerm == null) {
        console.log("No search term");
        searchTerm = 'mario';
        page = 1;
    }
    else {
        searchTerm = req.query.currentSearchTerm;
        page = req.query.page;
    }

    console.log(page);
    console.log(searchTerm);
    Flickr.tokenOnly(flickrOptions, function(error, flickr) {
  // we can now use "flickr" as our API object,
  // but we can only call public methods and access public data
      flickr.photos.search({
        page: page,
        per_page: PAGESIZE,
        safe_search : 1,
        content_type : 1,
        text : searchTerm,
        }, function(err, result) {
            console.log(err);
            console.log('TOtal Photos' + result.photos.total);
            var context = {
                //page":1,"pages":7685,"perpage":10,"total":"76844",
                page : result.photos.page,
                pages : result.photos.pages,
                perpage : result.photos.perpage,
                total : result.photos.total,
                photos : result.photos.photo,
                currentSearchTerm : searchTerm,
            };
            var jsonResult = JSON.stringify(result);
            console.log(jsonResult);
            res.render('gallery', context);
        });
    });
});

// gallery
app.post('/gallery', function(req, res){
    var searchTerm = req.body.searchTerm;
    var page = req.body.page;
    Flickr.tokenOnly(flickrOptions, function(error, flickr) {
  // we can now use "flickr" as our API object,
  // but we can only call public methods and access public data
      flickr.photos.search({
        page: 1,
        per_page: PAGESIZE,
        safe_search : 1,
        content_type : 1,
        text : searchTerm
        }, function(err, result) {
            console.log('TOtal Photos' + result.photos.total);
            var context = {
                //page":1,"pages":7685,"perpage":10,"total":"76844",
                page : result.photos.page,
                pages : result.photos.pages,
                perpage : result.photos.perpage,
                total : result.photos.total,
                photos : result.photos.photo,
                currentSearchTerm : searchTerm
            };
            var jsonResult = JSON.stringify(result);
            console.log(jsonResult);
            res.render('gallery', context);
        });
    });
});

app.post('/iterate', function(req, res){
    var searchText = req.searchTerm;
});

// cb
app.get('/cb', function(req, res) {
    console.log("cb rtequest " + req.query.oauth_token);
  res.write("");
  flickrOptions.exchange(req.query);

});

// static content
app.use(express.static(__dirname + '/public'));

//custom 404 page
app.use(function(err, res) {
    res.status(404);
    res.render('404');
});

//custom 500 page
app.use(function(err, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate');
});
