const Module = require("../models/Module");
const Event = require("../models/Event");
const { sendReminders } = require("../helpers/sendEmail");

exports.postModule = async (req, res, next) => {
  try {
    const { name, banner } = req.body;
    const newModule = new Module({ name, banner });
    newModule.save();
    res.json(true);
  } catch (error) {
    next(error);
  }
};

exports.postSendReminders = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findOne({ eventId })
      .populate("participants")
      .exec();
    sendReminders(event);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
