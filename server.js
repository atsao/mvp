// server.js

// Modules
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var morgan = require('morgan');

var server = express();

var port = process.env.PORT || 8080;

// server.use(morgan('dev'));

// Parse data as application/json
server.use(bodyParser.json());

var pickRouter = express.Router();

server.use(express.static('client'));

server.use('/api/pick', pickRouter);
require('./server/routes.js')(pickRouter);

server.listen(port);
console.log("PickPal is listening on", port);

exports = module.exports = server;