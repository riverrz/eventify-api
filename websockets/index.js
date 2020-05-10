const socketIO = require("socket.io");
const redisAdapter = require("socket.io-redis");

// a namespace would be userId and a room inside of this namespace would be eventId

class WebSocket {
  constructor() {
    this.io = null;
    this.namespaces = {};
  }
  init(server) {
    this.io = socketIO(server);
    this.io.adapter(
      redisAdapter({
        host: "localhost",
        port: 6379,
      })
    );
  }
  createNamespace(namespace) {
    if (!this.io) {
      throw new Error("SocketIO not initialised");
    }
    this.namespaces[namespace] = this.io.of(namespace);
  }
  getNamespace(namespace) {
    if (!this.namespaces.hasOwnProperty(namespace)) {
      this.createNamespace(namespace);
    }
    return this.namespaces[namespace];
  }
  disconnectById(socketId, removePermanent = true) {
    this.io.sockets.connected[socketId].disconnect(removePermanent);
  }
}

module.exports = new WebSocket();
