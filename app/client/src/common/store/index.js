import app from './app.js'
import socket from './socket.js'
import process from './process.js'
import flow from './flow.js'

// 내부 컴포넌트 간의 커스텀 이벤트 전달을 위한 객체
export default (function () {
  var handlers = {};
  var store_objs = {
    app: app,
    flow: flow,
    socket: socket,
    process: process,
  }
  return {
    all: store_objs,
    getProperty: function (path) {
      var count = 0;
      var path_arr = path.split('.')
      var result = path_arr.reduce(function (d, index) {
        count++;

        return d[index]
      }, store_objs)
      return result;
    },
    setProperty: function (path, value) {
      var count = 0;
      var path_arr = path.split('.')
      var result = path_arr.reduce(function (d, index) {
        count++;
        if (count === path_arr.length) {
          d[index] = value
        }
        return d[index]
      }, store_objs);

      if (handlers[path]) {
        for (var i = 0; i < handlers[path].length; i++) {
          try {
            handlers[path][i].apply(null, [value]);
          } catch (err) {
            console.log("common.store.set error: [" + path + "] " + (err.toString()));
            console.log(err);
          }
        }
      }
      return result;
    },
    onProperty: function (path, callback) {
      handlers[path] = handlers[path] || [];
      handlers[path].push(callback);
    },
    offProperty: function (path, callback) {
      var handler = handlers[path];
      if (handler) {
        for (var i = 0; i < handler.length; i++) {
          if (handler[i] === callback) {
            handler.splice(i, 1);
            return;
          }
        }
      }
    }
  }
})();
