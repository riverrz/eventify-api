const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { isAuth } = require("../middlewares/auth");

router.patch("/balance", isAuth, userController.patchBalance);

module.exports = router;
