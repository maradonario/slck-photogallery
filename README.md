# FLICKR API CLIENT GALLERY

1. Install node.js from here: [Node.JS 4.4.7 LTS](https://nodejs.org/en/)
2. clone project:`git clone https://github.com/maradonario/slck-photogallery.git`
3. Add a `credentials.js` file, should include the Flickr API key and secret:
```
module.exports = {
    flickr : {
        key : '[key here]',
        secret: '[secret here]]'
    }
};
```
4. run the command to install the required modules:
`npm install`

5. run the web server locally by calling `index.js` from the root folder of the app:
`node index.js`

6. Using a browser go to `http://localhost:3000/gallery`
