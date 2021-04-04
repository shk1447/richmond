import Http from './Http.js'
import EventHandler from './EventHandler.js'
import WebSocket from './WebSocket.js';
export default {
  // api indexer
  Http: Http,
  EventHandler: EventHandler,
  WebSocket: WebSocket,
  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 3 | 8);
      return v.toString(16);
    });
  }
}
