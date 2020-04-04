const express = require("express");
const router = express.Router();

const callBackController = require("../controllers/callBackController");

// Callback URL for paytm
router.post("/", callBackController.postHandleTransaction);

module.exports = router;
