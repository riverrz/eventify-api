const WebSocket = require("../websockets");

exports.clearRoomInsideNamespace = async (room, namespace, cb = () => {}) => {
  return new Promise((resolve) => {
    namespace.in(room).clients((err, clients) => {
      if (err) {
        return;
      }
      clients.forEach((socketId) => {
        WebSocket.disconnectById(socketId, true);
        cb(socketId);
      });
      resolve();
    });
  });
};

exports.emitToRoomInNamespace = (room, namespace, { message, data }) => {
  namespace.to(room).emit(message, data);
};
