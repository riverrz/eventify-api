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
    req.body.eventId = "E-"+splitArr[2];
    req.body.participationId = splitArr[3];
    next();
  } catch (error) {
    next(error);
  }
};
