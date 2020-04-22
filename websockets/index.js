const socketIO = require("socket.io");

// a namespace would be userId and a room inside of this namespace would be eventId

class WebSocket {
  constructor() {
    this.io = null;
    this.namespaces = {};
  }
  init(server) {
    this.io = socketIO(server);
  }
  createNamespace(namespace) {
    if (!this.io) {
      throw new Error("SocketIO not initialised");
    }
    this.namespaces[namespace] = io.of(namespace);
  }
  getNamespace(namespace) {
    if(!this.namespaces.hasOwnProperty(namespace)) {
      this.createNamespace(namespace);
    }
    return this.namespaces[namespace];
  }
}

module.exports = new WebSocket();
