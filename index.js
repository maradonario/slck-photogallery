var express = require('express');
var app = express();
var credentials = require('./credentials.js');

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
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// set port
app.set('port', process.env.PORT || 3000);

// static content
app.use(express.static(__dirname + '/public'));

// home page
app.get('/', function(req, res) {
    console.log("home");
    Flickr.authenticate(flickrOptions, function(error, flickr) {
    // we can now use "flickr" as our API object
    console.log("calling seqarch api");
    flickr.photos.search({
        user_id: flickr.options.user_id,
        page: 1,
        per_page: 500
        }, function(err, result) {
        // result is Flickr's response
            console.log("RESPONDED");
            var jsonResult = JSON.stringify(result);
            console.log(jsonResult);
        });
    });    
    console.log("redering home view");
    res.render('home');

});

// gallery
app.get('/gallery', function(req, res){
    Flickr.tokenOnly(flickrOptions, function(error, flickr) {
  // we can now use "flickr" as our API object,
  // but we can only call public methods and access public data
      flickr.photos.search({
        page: 1,
        per_page: 10,
        safe_search : 1,
        content_type : 1,
        text : 'slack'
        }, function(err, result) {
            var jsonResult = JSON.stringify(result);
            console.log(jsonResult);
        });
    });
    res.render('gallery');
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
