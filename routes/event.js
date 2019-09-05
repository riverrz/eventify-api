const express = require("express");

const router = express.Router();

const eventController = require("../controllers/eventController");

const { isAuth } = require("../middlewares/auth");
const { correctParticipantCount} = require("../middlewares/events");

router.get("/:eventId", eventController.getEvent);

router.post("/", isAuth, correctParticipantCount, eventController.postEvent);

module.exports = router;
