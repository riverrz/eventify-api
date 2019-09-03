const express = require("express");

const router = express.Router();

const eventController = require("../controllers/eventController");

const { isAuth } = require("../middlewares/auth");

router.get("/:eventId", eventController.getEvent);

router.post("/", isAuth, eventController.postEvent);

module.exports = router;
