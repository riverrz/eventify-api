const Event = require("../models/Event");

exports.postEvent = async (req, res, next) => {
  try {
    const eventObject = {
      creatorId: req.user.userId,
      startTimeStamp: new Date(req.body.startTimeStamp),
      endTimeStamp: new Date(req.body.endTimeStamp)
    };

    const newEvent = new Event(eventObject);
    await newEvent.save();
    res.status(201).json({
      success: true
    });
  } catch (error) {
    next(error);
  }
};
