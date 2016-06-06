// server.js

// Modules
var express = require('express');
var parser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

// var db = require('./config/db');

var port = process.env.PORT || 8080;

// Connect to database - credentials in config/db.js
// mongoose.connect(db.url);

// Parse data as application/json
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.use(express.static(__dirname + '/public'));

require('./app/routes')(app); // Configure routes

app.listen(port);
console.log("Listening on", port);

exports = module.exports = app;

