const { getClient } = require("../config/redisConfig");
const { TIMER_OVER, TIMER_SYNC } = require("../websockets/constants");

class PersistentTimer {
  constructor(init) {
    const { duration, userId, eventId, cb } = init;
    const redisClient = getClient();
    let calculatedDuration = duration;
    redisClient.get(`${userId}-${eventId}`, (err, startedTimeStamp) => {
      if (startedTimeStamp) {
        calculatedDuration -=
          new Date().getTime() - new Date(startedTimeStamp).getTime();
      } else {
        redisClient.set(`${userId}-${eventId}`, new Date().toJSON());
      }
      const interval = setInterval(() => {
        if (calculatedDuration < 0) {
          cb(TIMER_OVER, null);
          clearInterval(interval);
        } else {
          cb(TIMER_SYNC, calculatedDuration);
          calculatedDuration -= 1000;
        }
      }, 1000);
    });
  }
}

module.exports = PersistentTimer;
