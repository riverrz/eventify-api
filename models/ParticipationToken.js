const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const participationTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      index: true
    },
    eventId: {
      type: String,
      required: true,
    },
    recipient: {
      type: "String",
      required: true,
      index: true
    },
    expiration: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

participationTokenSchema.virtual("event", {
  ref: "Event",
  localField: "eventId",
  foreignField: "eventId",
  justOne: true
})

module.exports = new model("ParticipationToken", participationTokenSchema);
