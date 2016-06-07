// server.js

// Modules
var express = require('express');
var parser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var morgan = require('morgan');

var server = express();

// var db = require('./config/db');

var port = process.env.PORT || 8080;

// Connect to database - credentials in config/db.js
// mongoose.connect(db.url);

server.use(morgan('dev'));

// Parse data as application/json
server.use(parser.urlencoded({ extended: true }));
server.use(parser.json());

var pickRouter = express.Router();

server.use(express.static(path.join(__dirname, 'client')));
// server.use('/client/bower_components', express.static(path.join(__dirname, 'client', 'bower_components')));

// require('./server/routes')(server); // Configure routes

server.use('/api/pick', pickRouter);
require('./server/routes.js')(pickRouter);

server.listen(port);
console.log("Listening on", port);

exports = module.exports = server;

