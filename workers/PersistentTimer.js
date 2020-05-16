const { getClient } = require("../config/redisConfig");
const { TIMER_OVER, TIMER_SYNC } = require("../websockets/constants");

class PersistentTimer {
  constructor() {
    this.timers = {}; // userId-eventId -> interval
  }
  async createTimer(init) {
    const { duration, key, cb, expiry } = init;
    const redisClient = getClient();
    let calculatedDuration = duration;
    try {
      const startedTimeStamp = await redisClient.get(key);

      if (startedTimeStamp) {
        calculatedDuration -=
          new Date().getTime() - new Date(startedTimeStamp).getTime();
      } else {
        await redisClient.set(key, new Date().toJSON(), "PX", expiry);
      }

      const interval = setInterval(() => {
        if (calculatedDuration < 0) {
          cb(TIMER_OVER, null);
          this.removeTimer(key);
        } else {
          cb(TIMER_SYNC, calculatedDuration);
          calculatedDuration -= 1000;
        }
      }, 1000);
      this.timers[key] = interval;
    } catch (error) {
      console.log("Error");
      throw err;
    }
  }
  removeTimer(key) {
    if (this.timers[key]) {
      clearInterval(this.timers[key]);
      delete this.timers[key];
    }
  }
}

module.exports = new PersistentTimer();
