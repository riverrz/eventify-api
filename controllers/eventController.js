const { map, prop, pick, evolve, compose, merge } = require("ramda");
const Event = require("../models/Event");
const ParticipationToken = require("../models/ParticipationToken");
const User = require("../models/User");
const Modules = require("../models/Module");
const manageParticipationTokens = require("../workers/manageParticipationTokens");
const calcExpirationInSeconds = require("../helpers/calcExpirationInSeconds");

const eventTransformation = {
  startTimeStamp: (date) => new Date(date),
  endTimeStamp: (date) => new Date(date),
  duration: (val) => val * 60 * 1000, // convert to milliseconds
};

async function getCreatedEvents(events) {
  try {
    const createdEvents = await Event.find()
      .where("_id")
      .in(events)
      .select("-_id -content -modules")
      .exec();
    return createdEvents;
  } catch (error) {
    throw error;
  }
}

async function getInvitedEvents(email) {
  try {
    const tokens = await ParticipationToken.find({
      recipient: email,
    }).select("eventId");
    const eventIds = map(prop("eventId"), tokens);
    const invitedEvents = await Event.find({
      endTimeStamp: { $gte: new Date() },
    })
      .where("eventId")
      .in(eventIds)
      .select("-_id -content -modules")
      .exec();
    return invitedEvents;
  } catch (error) {
    throw error;
  }
}

exports.getEvent = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const foundEvent = await Event.findOne({ eventId })
      .select("-content -_id -modules")
      .populate("creator", "username email userId -_id")
      .exec();
    if (!foundEvent) {
      const error = new Error("No such event exists!");
      error.statusCode = 404;
      return next(error);
    }
    res.json(foundEvent);
  } catch (error) {
    next(error);
  }
};

exports.getAllEvent = async (req, res, next) => {
  try {
    const allEvents = await Promise.all([
      getInvitedEvents(req.user.email),
      getCreatedEvents(req.user.events),
    ]);
    const allEventsObj = {
      invitedEvents: allEvents[0],
      createdEvents: allEvents[1],
    };
    res.json(allEventsObj);
  } catch (error) {
    next(error);
  }
};

exports.getCreatedEvents = async (req, res, next) => {
  try {
    const createdEvents = await getCreatedEvents(req.user.events);
    res.json(createdEvents);
  } catch (error) {
    next(error);
  }
};

exports.getInvitedEvents = async (req, res, next) => {
  try {
    const invitedEvents = await getInvitedEvents(req.user.email);
    res.json(invitedEvents);
  } catch (error) {
    next(error);
  }
};

exports.postEvent = async (req, res, next) => {
  try {
    const eventObject = compose(
      evolve(eventTransformation),
      merge({ creatorId: req.user.userId }),
      pick([
        "startTimeStamp",
        "endTimeStamp",
        "totalParticipantsAllowed",
        "title",
        "description",
        "banner",
        "modules",
        "content",
        "type",
        "duration",
      ]),
      req.body
    );
    // Create and save event
    const newEvent = new Event(eventObject);
    await newEvent.save();

    await User.findOneAndUpdate(
      { userId: req.user.userId },
      { $push: { events: newEvent._id } }
    );

    // send emails to participants
    manageParticipationTokens(
      newEvent,
      req.user.username,
      [...req.body.emailArr, req.user.email],
      calcExpirationInSeconds(newEvent.startTimeStamp, newEvent.endTimeStamp)
    );

    res.status(201).json({
      eventId: newEvent.eventId,
    });
  } catch (error) {
    next(error);
  }
};

exports.postParticipate = async (req, res, next) => {
  try {
    const foundEvent = await Event.findOne({ eventId: req.body.eventId });
    if (!foundEvent) {
      const error = new Error("Invalid participation token!");
      error.statusCode = 403;
      return next(error);
    }
    // check if user has already confirmed his seat for the event
    if (foundEvent.participants.includes(req.user.userId.toString())) {
      const error = new Error("You have already confirmed your seat!");
      error.statusCode = 403;
      return next(error);
    }

    foundEvent.participants.push(req.user.userId);
    await foundEvent.save();

    res.json(true);
  } catch (error) {
    next(error);
  }
};

exports.getModules = async (req, res, next) => {
  try {
    const data = await Modules.find({}).select("name moduleId -_id");
    res.json(data);
  } catch (error) {
    next(error);
  }
};
