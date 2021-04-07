const url = require('url');
const http = require('http');
const express = require('express');
const WebSocket = require('ws');

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