var express = require('express');
var app = express();
var credentials = require('./credentials.js');
var PAGESIZE = 12;
var DEFAULTSEARCH = "SF GIANTS";

var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: credentials.flickr.key,
      secret: credentials.flickr.secret,
      callback : "http://localhost:3000/cb",
      progress: false
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
                return options.inverse(this);
            }
            return options.fn(this);
        }
    }
});

function callFlickr(page, searchTerm, res) {
    Flickr.tokenOnly(flickrOptions, function(error, flickr) {
      flickr.photos.search({
        page: page,
        per_page: PAGESIZE,
        safe_search : 1,
        content_type : 1,
        text : searchTerm
        }, function(err, result) {
            var context = {
                page : result.photos.page,
                pages : result.photos.pages,
                perpage : result.photos.perpage,
                total : result.photos.total,
                photos : result.photos.photo,
                currentSearchTerm : searchTerm
            };
            res.render('gallery', context);
        });
    });
};

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

// gallery
app.get('/gallery', function(req, res){
    var searchTerm = '';
    var page = '';
    if (req.query.currentSearchTerm == null) {
        searchTerm = DEFAULTSEARCH;
        page = 1;
    }
    else {
        searchTerm = req.query.currentSearchTerm;
        page = req.query.page;
    }
    callFlickr(page, searchTerm, res);
});

// gallery
app.post('/gallery', function(req, res){
    var searchTerm = req.body.searchTerm;
    var page = 1;
    callFlickr(page, searchTerm, res);
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
