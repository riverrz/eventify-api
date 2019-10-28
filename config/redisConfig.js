const redis = require("redis");
const bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
let client;

module.exports = {
  redisInit: () => {
    client = redis.createClient();
    client.on("error", function(err) {
      console.log("Error " + err);
    });
    client.on("ready", function() {
      console.log("Redis is ready");
    });
  },
  getClient: () => client
};
