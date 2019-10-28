const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const participationTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true
    },
    expiration: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = new model("ParticipationToken", participationTokenSchema);
