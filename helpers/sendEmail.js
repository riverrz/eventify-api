const sgMail = require("@sendgrid/mail");
const keys = require("../keys/keys");

sgMail.setApiKey(keys.SENDGRID_API_KEY);

module.exports = emailAddress => {
  // send email via sendgrid
  const msg = {
    to: emailAddress,
    from: "admin@eventify.com",
    subject: "Participation Link",
    text: "Use this link to participate in the event: "
  };
  sgMail.send(msg);
};
