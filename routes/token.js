const express = require("express");

const router = express.Router();

const tokenController = require("../controllers/tokenController");

const { isAuth } = require("../middlewares/auth");

router.get("/", isAuth, tokenController.getToken);

module.exports = router;
