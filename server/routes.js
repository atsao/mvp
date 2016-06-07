var Q = require('q');

var config = require('../config');
var Yelp = require('yelp');

var yelp = new Yelp({
  consumer_key: config.yelp.consumer_key,
  consumer_secret: config.yelp.consumer_secret,
  token: config.yelp.token,
  token_secret: config.yelp.token_secret,
});

module.exports = function(server) {
  server.route('/').get(function(req, res) {
    // res.end('WADDUP BITCH');
    console.log('inside server GET');
    yelp.search({ term: 'food', location: 'San Francisco' })
    .then(function (data) {
      console.log(data);
      res.json(data);
    })
    .catch(function (err) {
      console.error(err);
    });
  });
}