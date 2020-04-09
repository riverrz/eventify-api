const fetch = require("node-fetch");
const keys = require("../keys");

module.exports = async function (agenda) {
  try {
    // send out reminder emails for the users who have agreed to participate
    agenda.define("Reminder Emails", async (job) => {
      const { eventId } = job.attrs.data;
      await fetch(`${keys.SELF}/admin/sendreminders`, {
        method: "POST",
        body: JSON.stringify({ eventId }),
      });
    });
  } catch (error) {
    console.log(error);
  }
};
