const express = require("express");

const router = express.Router();

const eventController = require("../controllers/eventController");

const { isAuth } = require("../middlewares/auth");
const {
  correctParticipantCount,
  splitParticipationToken,
  validateParticipationToken,
  validTimeStamps,
  validateModules,
  validTypeOfEvent,
  isParticipant,
} = require("../middlewares/events");

router.get("/all", isAuth, eventController.getAllEvent);

router.get("/created", isAuth, eventController.getCreatedEvents);

router.get("/invited", isAuth, eventController.getInvitedEvents);

router.get("/modules", isAuth, eventController.getModules);

router.post(
  "/start/:eventId",
  isAuth,
  isParticipant,
  eventController.postStartEvent
);

router.get("/:eventId", eventController.getEvent);

router.post(
  "/",
  isAuth,
  validTimeStamps,
  correctParticipantCount,
  validTypeOfEvent,
  eventController.postEvent
);

router.post(
  "/participate",
  isAuth,
  validateParticipationToken,
  splitParticipationToken,
  validateModules,
  eventController.postParticipate
);

module.exports = router;
