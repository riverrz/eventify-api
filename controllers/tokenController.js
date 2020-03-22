const ParticipationToken = require("../models/ParticipationToken");

exports.getToken = async ({ req, res, next }) => {
  try {
    const { eventId } = req.query;
    const { email } = req.user;
    const token = await ParticipationToken.findOne({
      recipient: email,
      eventId
    });
    res.json(token);
  } catch (error) {
    next(error);
  }
};
