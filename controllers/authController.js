const User = require("../models/User");
const bcrypt = require("bcrypt-nodejs");
const { genToken } = require("../helpers/jwtToken");

exports.getCurrent = (req, res, next) => {
  if (!req.user) {
    const error = new Error("An error occurred");
    return next(error);
  }
  // remove password field before sending the response
  req.user = JSON.parse(JSON.stringify(req.user));
  delete req.user.password;
  res.json(req.user);
};

exports.postRegister = async (req, res, next) => {
  try {
    // Validate req.body first!

    // Extracting
    const userObj = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    };
    // Check if username/email is already registered.
    const foundUser = await User.findOne({
      $or: [{ email: userObj.email }, { username: userObj.username }]
    });
    if (foundUser) {
      const error = new Error("This username/email is already in use");
      error.statusCode = 403;
      return next(error);
    }
    bcrypt.genSalt(12, async (err, salt) => {
      if (err) {
        return next(err);
      }
      bcrypt.hash(userObj.password, salt, null, async (err, hash) => {
        if (err) {
          return next(err);
        }
        userObj.password = hash;
        try {
          const user = new User(userObj);
          await user.save();
          res.status(201).json({
            success: true
          });
        } catch (error) {
          next(error);
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

exports.postLogin = async (req, res, next) => {
  // Validate req.body
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Invalid email/password");
      error.statusCode = 401;
      return next(error);
    }
    bcrypt.compare(password, user.password, async (err, isMatch) => {
      if (err) {
        const error = new Error("An error occurred");
        return next(error);
      }
      if (!isMatch) {
        const error = new Error("Invalid email/password");
        error.statusCode = 401;
        return next(error);
      }
      const token = await genToken({ userId: user.userId });
      res.json({ success: true, token });
    });
  } catch (error) {
    next(error);
  }
};
