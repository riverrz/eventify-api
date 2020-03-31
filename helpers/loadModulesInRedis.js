const { map, pick } = require("ramda");
const Module = require("../models/Module");
const { getClient } = require("../config/redisConfig");

module.exports = async () => {
  try {
    const redisClient = getClient();
    const modules = await Module.find({});
    const data = map(pick(["moduleId", "name"]), modules);
    const promiseArr = map(
      async ({ moduleId, name }) =>
        redisClient.hmset(moduleId, "name", name, "moduleId", moduleId),
      data
    );
    await Promise.all(promiseArr);
    console.log("Modules loaded in redis successfully!");
    
  } catch (error) {
    console.log("Couldn't load modules in redis!");
    console.log(error.message);
  }
};
