const mongoose = require("mongoose");
const generateRandomToken = require("../helpers/generateRandomToken");

const moduleSchema = new mongoose.Schema({
  moduleId: {
    type: String,
    unique: true,
    index: true
  },
  name: {
    type: String,
    unique: true
  },
  banner: {
    type: String
  }
});

moduleSchema.pre("save", async function() {
  if (!this.moduleId) {
    try {
      const token = await generateRandomToken(2);
      this.moduleId = "M-" + token;
    } catch (error) {
      throw error;
    }
  }
});


module.exports = new mongoose.model("Module", moduleSchema)