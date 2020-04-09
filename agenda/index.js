const agenda = require("agenda");
const keys = require("../keys");

module.exports = new agenda({
  db: { address: keys.DB_URI, collection: keys.AGENDA_COLLECTION_NAME },
  processEvery: "60 seconds",
});
