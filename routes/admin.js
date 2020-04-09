const express = require("express");

const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/module", adminController.postModule);
router.post("/sendreminders", adminController.postSendReminders)

module.exports = router;
