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
