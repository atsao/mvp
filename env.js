// env.js

// Local variables from config.js
// module.exports = {
//   yelp: {
//     consumer_key: require('./config').yelp.consumer_key,
//     consumer_secret: require('./config').yelp.consumer_secret,
//     token: require('./config').yelp.token,
//     token_secret: require('./config').yelp.token_secret,
//   }
// }

// Deployed - use environment variables
module.exports = {
  yelp: {
    consumer_key: process.env.YELP.CONSUMER_KEY,
    consumer_secret: process.env.YELP.CONSUMER_SECRET,
    token: process.env.YELP.TOKEN,
    token_secret: process.env.YELP.TOKEN_SECRET,
  }
}