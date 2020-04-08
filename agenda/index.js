const agenda = require("agenda");
const keys = require("../keys");

class AgendaWrapper {
  constructor() {
    this.agenda = new agenda({
      db: { address: keys.DB_URI, collection: keys.AGENDA_COLLECTION_NAME },
      processEvery: "60 seconds",
    });
    this.start = this.agenda.start;
  }
  async scheduleJob({ name, options, scheduleString, data, cb }) {
    this.agenda.define(name, options, cb);
    await this.agenda.schedule(scheduleString, name, data);
  }
}

module.exports = new AgendaWrapper();
