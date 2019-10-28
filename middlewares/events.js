const ParticipationToken = require("../models/ParticipationToken");
const { getClient } = require("../config/redisConfig");
const redisClient = getClient();

exports.correctParticipantCount = (req, res, next) => {
  if (req.body.totalParticipantsAllowed != req.body.emailArr.length) {
    const error = new Error(
      "Total participants allowed and number of email ids provided must match"
    );
    error.statusCode = 401;
    return next(error);
  }
  next();
};

exports.splitParticipationToken = (req, res, next) => {
  try {
    const splitArr = req.body.participationToken.split("-");
    if (splitArr.length < 4) {
      const error = new Error("Invalid participation token.");
      error.statusCode = 403;
      return next(error);
    }
    req.body.eventId = "E-" + splitArr[2];
    req.body.participationId = splitArr[3];
    next();
  } catch (error) {
    next(error);
  }
};

exports.validateParticipationToken = async (req, res, next) => {
  // check if participationId is valid
  const token = req.body.participationToken;
  if (!token) {
    const error = new Error("Participation token not found");
    error.statusCode = 404;
    return next(error);
  }
  // check if the token is present in redis first
  try {
    try {
      const foundInRedis = await redisClient.getAsync(token);
      if (foundInRedis) {
        return next();
      }
    } catch (error) {
      console.log(error);
    }
    const foundInMongo = await ParticipationToken.findOne({ token });
    if (foundInMongo) {
      return next();
    }

    // if token not found in redis and mongo then raise an error
    const error = new Error("Invalid participation token");
    error.statusCode = 403;
    return next(error);
  } catch (error) {
    throw error;
  }
};
