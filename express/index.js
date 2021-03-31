const url = require('url');
const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const TypedJson = require('../app/TypedJson/index.js')

var data = require('./data');
var stat = {
  length: 'uint',
  min: 'uint',
  q1: 'uint',
  median: 'uint',
  q3: 'uint',
  max: 'uint',
  total: 'uint',
  avg: 'float'
}

var schema = new TypedJson({
  data: [{
    date: 'date',
    stats: {
      a: stat,
      b: stat,
      c: stat,
      d: stat,
      e: stat
    }
  }]
})
for (var i = 0; i < 1000; i++) {
  data.data.push(data.data[0]);
}

var app = express();

var server = http.createServer(app);

server.listen(8081, '0.0.0.0', function () {
  console.log('start server port 8081!')
})

const wss = new WebSocket.Server({ noServer: true });
wss.binaryType = "arraybuffer";

var test = false;
wss.on('connection', function (ws, req) {
  ws.on('open', () => {

  })
  ws.on('message', (message) => {

  });
  ws.on('close', () => {

  });
  if (test) {

  }
  for (var i = 0; i < 1000; i++) {
    // ws.send(JSON.stringify(data));
    var test = schema.encode(data)
    ws.send(test.buffer);
  }
  // for(var i = 0; i < 10000; i++) {

  // }
  console.log('connected');
})

server.on('upgrade', function (request, socket, head) {
  const pathname = url.parse(request.url).pathname;
  if (pathname === '/sock') {
    wss.handleUpgrade(request, socket, head, function (ws) {
      wss.emit('connection', ws, request);
    })
  } else {
    socket.destory();
  }
})