const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const { isAuth } = require("../middlewares/auth");

router.get("/current", isAuth, authController.getCurrent);

router.post("/register", authController.postRegister);

router.post("/login", authController.postLogin);

module.exports = router;
