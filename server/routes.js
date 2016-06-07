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
  server.route('/').post(function(req, res) {
    // console.log('req.body.term: ', req.body.term);
    console.log('req.body: ', req.body);
    // yelp.search({ term: 'bbq', location: 'San Francisco' })
    yelp.search(req.body)
    .then(function (data) {
      res.json(data);
    })
    .catch(function (err) {
      console.error(err);
    });
  });
}