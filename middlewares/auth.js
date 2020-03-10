const User = require("../models/User");
const { verifyToken } = require("../helpers/jwtToken");

exports.isAuth = async (req, res, next) => {
  try {
    const payload = verifyToken(req.headers.authorization);
    if (payload.error) {
      const error = new Error(payload.message);
      return next(error);
    }
    const user = await User.findOne({ userId: payload.userId }).select(
      "username email userId _id events"
    );
    if (!user) {
      const error = new Error("Invalid token");
      error.statusCode = 402;
      return next(error);
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
