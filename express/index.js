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
var user_list = [];
ws.setSchema('user', [{ id: 'string', name: 'string' }]);
ws.setSchema('user.add', { id: 'string', name: 'string' });
ws.setSchema('user.remove', { id: 'string' });
ws.listen({ noServer: true, path: '/light.sock' }, server);
ws.setSchema('login', {email:'string'})
ws.setSchema('sendMessage', {to_email:'string', message:'string'});

ws.on('login', function(data, client) {
  client['email'] = data.email;
  ws.send('login', data, data)
})

ws.on('sendMessage', function(data, client) {
  ws.send('sendMessage', data, {email:data.to_email})
})

ws.on('user.add', function (data) {
  user_list.push(data);
  ws.send('user', user_list)
})

ws.on('user', function(data) {
  ws.send('user', user_list);
})