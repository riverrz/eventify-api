const ParticipationToken = require("../models/ParticipationToken");
const { getClient } = require("../config/redisConfig");
const redisClient = getClient();

exports.validTimeStamps = (req, res, next) => {
  const { startTimeStamp, endTimeStamp } = req.body;
  if (!startTimeStamp || !endTimeStamp) {
    const error = new Error("Start timestamp / End timestamp is missing");
    error.statusCode = 400;
    return next(error);
  } else if (new Date(startTimeStamp) > new Date(endTimeStamp)) {
    const error = new Error(
      "Start timestamp cannot be greater than End timestamp"
    );
    error.statusCode = 400;
    return next(error);
  }
  next();
};

exports.correctParticipantCount = (req, res, next) => {
  if (req.body.totalParticipantsAllowed != req.body.emailArr.length) {
    const error = new Error(
      "Total participants allowed and number of email ids provided must match"
    );
    error.statusCode = 401;
    return next(error);
  } else if (req.body.totalParticipantsAllowed > 100) {
    const error = new Error("Total participants cannot be greater than 100!");
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
      const recipient = await redisClient.getAsync(token);
      if (recipient && recipient === req.user.email) {
        return next();
      }
    } catch (error) {
      console.log(error);
    }
    const { recipient } = await ParticipationToken.findOne({ token });
    if (recipient && recipient === req.user.email) {
      return next();
    }

    // if token not found in redis and mongo then raise an error
    const error = new Error(
      "Invalid participation token / You are not authorized to use this token"
    );
    error.statusCode = 403;
    throw error;
  } catch (error) {
    next(error);
  }
};
