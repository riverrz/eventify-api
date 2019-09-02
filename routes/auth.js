const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const { isAuth } = require("../middlewares/auth");

router.get("/current", isAuth, authController.getCurrent);

module.exports = router;
