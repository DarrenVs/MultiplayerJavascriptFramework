//--		Index	   --\\
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


exports.express = express
exports.app = app;
exports.server = server;
exports.io = io;