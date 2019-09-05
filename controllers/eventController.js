const Event = require("../models/Event");

const emailHandler = require("../workers/emailHandler");

exports.getEvent = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const foundEvent = await Event.findOne({ eventId })
      .select("creatorId creator startTimeStamp endTimeStamp eventId -_id")
      .populate("creator", "username email userId -_id")
      .exec();
    if (!foundEvent) {
      const error = new Error("No such event exists!");
      error.statusCode = 404;
      return next(error);
    }
    res.json({
      success: true,
      event: foundEvent
    });
  } catch (error) {
    next(error);
  }
};

exports.postEvent = async (req, res, next) => {
  try {
    const eventObject = {
      creatorId: req.user.userId,
      startTimeStamp: new Date(req.body.startTimeStamp),
      endTimeStamp: new Date(req.body.endTimeStamp),
      totalParticipantsAllowed: req.body.noOfParticipants
    };
    // Create and save event
    const newEvent = new Event(eventObject);
    await newEvent.save();

    // send emails to participants
    emailHandler(req.body.emailArr);

    res.status(201).json({
      success: true,
      eventId: newEvent.eventId
    });
  } catch (error) {
    next(error);
  }
};

exports.postParticipate = (req, res, next) => {};
