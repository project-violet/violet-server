#!/usr/bin/env node

var app = require('./app');
var http = require('http');

var port = process.env.PORT || '7788';
app.set('port', port);

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);

function onError(error) {
}