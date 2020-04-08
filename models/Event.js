const mongoose = require("mongoose");
const generateRandomToken = require("../helpers/generateRandomToken");

const eventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      unique: true,
      index: true
    },
    creatorId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    banner: {
      type: String
    },
    description: {
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
    },
    totalParticipantsAllowed: {
      type: Number,
      default: 1
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    modules: {
      type: [String]
    }
  },
  {
    timestamps: true,
    id: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

eventSchema.pre("save", async function() {
  if (!this.eventId) {
    try {
      const token = await generateRandomToken(8);
      this.eventId = "E-" + token;
    } catch (error) {
      throw error;
    }
  }
});

eventSchema.virtual("creator", {
  ref: "User",
  localField: "creatorId",
  foreignField: "userId",
  justOne: true
});

module.exports = new mongoose.model("Event", eventSchema);
