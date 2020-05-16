const WebSocket = require("../websockets");

exports.getClientsInRoom = async (room, namespace) => {
  return new Promise((resolve, reject) => {
    namespace.in(room).clients((err, clients) => {
      if (err) {
        return reject(err);
      }
      resolve(clients);
    });
  });
};

exports.emitToRoomInNamespace = (room, namespace, { message, data }) => {
  namespace.to(room).emit(message, data);
};
