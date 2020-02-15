const express = require("express");

const router = express.Router();

const eventController = require("../controllers/eventController");

const { isAuth } = require("../middlewares/auth");
const {
  correctParticipantCount,
  splitParticipationToken,
  validateParticipationToken,
  validTimeStamps
} = require("../middlewares/events");

router.get("/:eventId", eventController.getEvent);

router.post("/", isAuth, validTimeStamps ,correctParticipantCount, eventController.postEvent);

router.post(
  "/participate",
  isAuth,
  validateParticipationToken,
  splitParticipationToken,
  eventController.postParticipate
);

module.exports = router;
