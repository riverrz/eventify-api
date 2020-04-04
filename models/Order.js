const mongoose = require("mongoose");
const generateToken = require("../helpers/generateRandomToken");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    totalPrice: {
      type: Number,
      required: true
    },
    STATUS: {
      type: String,
      default: "PENDING"
    },
    orderId: {
      type: String,
      index: true
    },
    author: {
      type: String,
      required: true,
      index: true
    },
    TXNID: {
      type: String
    },
    BANKTXNID: {
      type: String
    },
    TXNDATE: {
      type: Date
    }
  },
  { timestamps: true }
);
orderSchema.pre("save", async function() {
  try {
    if (!this.orderId) {
      this.orderId = "O-" + (await generateToken(12));
    }
  } catch (err) {
    throw err;
  }
});
module.exports = mongoose.model("Order", orderSchema);
