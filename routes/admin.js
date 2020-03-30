const express = require("express");

const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/module", adminController.postModule);

module.exports = router;
