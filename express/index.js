const url = require('url');
const http = require('http');
const express = require('express');
const LWS = require('light-ws');

var app = express();

var server = http.createServer(app);

server.listen(8081, '0.0.0.0', function () {
  console.log('start server port 8081!')
})

var ws = new LWS();
ws.setSchema('user', { id: 'string', name: 'string' });
ws.listen({ noServer: true, path: '/light.sock' }, server);

ws.on('user', function (data) {
  console.log(data);
})

setInterval(function () {
  ws.broadcast('user', { id: "aaa", name: "aaa" })
}, 1000)