const express = require("express");
const router = express.Router();

const { isAuth } = require("../middlewares/auth");

router.patch("/balance", isAuth);

module.exports = router;
