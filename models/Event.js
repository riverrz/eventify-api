const mongoose = require("mongoose");
const generateRandomToken = require("../helpers/generateRandomToken");

const eventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => "E-" + generateRandomToken(8)
    },
    creatorId: {
      type: String,
      required: true
    },
    startTimeStamp: {
      type: Date,
      required: true
    },
    endTimeStamp: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true,
    id: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

eventSchema.virtual("creator", {
  ref: "User",
  localField: "creatorId",
  foreignField: "userId",
  justOne: true
});

module.exports = new mongoose.model("Event", eventSchema);
