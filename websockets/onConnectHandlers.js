const { verifyToken } = require("../helpers/jwtToken");
const Event = require("../models/Event");
const PersistentTimer = require("../workers/PersistentTimer");
const WebSocket = require("../websockets");
const {
  clearRoomInsideNamespace,
  emitToRoomInNamespace,
} = require("./helpers");

const joinEventHandler = async (socket, nsp) => {
  return new Promise((resolve, reject) => {
    socket.on("join-event", async (data) => {
      const { token } = data;
      const payload = await verifyToken(token);
      if (payload.error) {
        socket.emit("unauthorised");
        reject("Unauthorised");
      }
      const { userId, eventId } = payload;
      const event = await Event.findOne({ eventId });

      // empty the room first if event is contentful
      if (event && event.type === "Contentful") {
        await clearRoomInsideNamespace(eventId, nsp, () => {
          PersistentTimer.removeTimer(`${userId}-${eventId}`);
        });
      }

      // Join the room
      socket.join(eventId, () => {
        socket.emit("join-event-successful");
        resolve();
      });
    });
  });
};

// All socket based events for contentFul events
const contentFulEventHandler = (socket, nsp) => {
  socket.on("fetch-content", async (data) => {
    const { token } = data;
    const payload = await verifyToken(token);
    if (payload.error) {
      return socket.emit("unauthorised");
    }
    const { userId, eventId } = payload;
    const event = await Event.findOne({ eventId });
    if (event) {
      socket.emit("populated-content", event.content);
    }
  });

  socket.on("initialise-timer", async (data) => {
    const { token } = data;
    const payload = await verifyToken(token);
    if (payload.error) {
      return socket.emit("unauthorised");
    }
    const { userId, eventId } = payload;
    const event = await Event.findOne({ eventId });
    if (!event) {
      return;
    }
    const { duration, endTimeStamp } = event;
    PersistentTimer.createTimer({
      duration,
      key: `${userId}-${eventId}`,
      cb: (message, data) =>
        emitToRoomInNamespace(eventId, nsp, { message, data }),
      expiry: new Date(endTimeStamp) - new Date(),
    });
    socket.emit("timer-initialised");
  });
};

module.exports = {
  joinEventHandler,
  contentFulEventHandler,
};
