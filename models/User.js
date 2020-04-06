const mongoose = require("mongoose");
const generateRandomToken = require("../helpers/generateRandomToken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    userId: {
      type: String,
      index: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.userId) {
    try {
      const token = await generateRandomToken();
      this.userId = "U-" + token;
    } catch (error) {
      throw error;
    }
  }
});

userSchema.methods.updateBalance = async function(newBalance) {
  if (newBalance < 0) {
    throw new Error("Invalid balance amount.");
  }
  this.balance = Number(newBalance);
  await this.save();
};

module.exports = new mongoose.model("User", userSchema);
