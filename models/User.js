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
      index: true,
      unique: true
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

userSchema.pre("save", async function() {
  if (!this.userId) {
    try {
      const token = await generateRandomToken();
      this.userId = "U-" + token;
    } catch (error) {
      throw error;
    }
  }
});

module.exports = new mongoose.model("User", userSchema);
