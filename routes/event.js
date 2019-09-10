const express = require("express");

const router = express.Router();

const eventController = require("../controllers/eventController");

const { isAuth } = require("../middlewares/auth");
const {
  correctParticipantCount,
  splitParticipationToken
} = require("../middlewares/events");

router.get("/:eventId", eventController.getEvent);

router.post("/", isAuth, correctParticipantCount, eventController.postEvent);

router.post(
  "/participate",
  isAuth,
  splitParticipationToken,
  eventController.postParticipate
);

module.exports = router;
