const ioRedis = require("ioredis");

let redis;

module.exports = {
  redisInit: () => {
    redis = new ioRedis();
  },
  getClient: () => redis,
};
