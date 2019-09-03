const mongoose = require("mongoose");
const generateRandomToken = require("../helpers/generateRandomToken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    userId: {
      type: String,
      required: true,
      index: true,
      unique: true,
      default: () => "U-" + generateRandomToken()
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = new mongoose.model("User", userSchema);
