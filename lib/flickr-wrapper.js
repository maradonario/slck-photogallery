var creds = require('../credentials');
var crypto = require('crypto');
var requestUri = 'https://www.flickr.com/services';
var requestTokenUri = "/oauth/request_token?";

exports.signRequest = function() {
    
    var getRequestUrl = 'GET&' + requestUri + requestTokenUri + '?' + 'oauth_callback=' + encodeURIComponent('http://localhost:3000') + '&oauth_consumer_key=' + creds.flickr.key + '&oauth_nonce=89601180&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1305583298&oauth_version=1.0'; 
    var key = creds.flickr.key  + '&' + creds.flickr.secret;
    var shacrypt = crypto.createHmac('sha1', key).update(url);
    var hash = shacrypt.digest('base64');
    console.log(hash);

//https://www.flickr.com/services/oauth/request_token
//?oauth_callback=http%3A%2F%2Fwww.example.com
//&oauth_consumer_key=653e7a6ecc1d528c516cc8f92cf98611
//&oauth_nonce=89601180&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1305583298&oauth_version=1.0
}

exports.getRequestToken = function(callbackUrl)
{
    var encodedCallback = encodeURI(callbackUrl);
    //var oauth_callbackVar=http%3A%2F%2Fwww.example.com

};

