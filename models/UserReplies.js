const mongoose = require("mongoose");

const userRepliesSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    eventId: {
      type: String,
      required: true,
    },
    replies: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("UserReplies", userRepliesSchema);
