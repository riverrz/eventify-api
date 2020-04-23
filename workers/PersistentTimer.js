const { getClient } = require("../config/redisConfig");

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
          clearInterval(interval);
        } else {
          cb(calculatedDuration);
          calculatedDuration -= 1000;
        }
      }, 1000);
    });
  }
}

module.exports = PersistentTimer;
