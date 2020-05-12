const socketIO = require("socket.io");
const redisAdapter = require("socket.io-redis");
const callAll = require("../helpers/callAll");
let onConnectHandlers;

// a namespace would be userId and a room inside of this namespace would be eventId

class WebSocket {
  constructor() {
    this.io = null;
    this.namespaces = {};
    this.socketMappings = {};
  }
  init(server) {
    onConnectHandlers = require("./onConnectHandlers");

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
    const nsp = this.io.of(namespace);

    nsp.on("connect", async (socket) => {
      try {
        const { joinEventHandler, ...handlers } = onConnectHandlers;
        await joinEventHandler(socket, nsp);

        callAll(...Object.values(handlers))(socket, nsp);
      } catch (error) {
        console.log(error.message);
      }
    });

    this.namespaces[namespace] = nsp;
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
  addSocketMapping(socketId, identifier) {
    this.socketMappings[socketId] = identifier;
  }
  removeSocketMapping(socketId) {
    delete this.socketMappings[socketId];
  }
}

module.exports = new WebSocket();
