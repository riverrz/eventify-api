const redis = require("redis");

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
