const sgMail = require("@sendgrid/mail");
const keys = require("../keys/keys");

sgMail.setApiKey(keys.SENDGRID_API_KEY);

module.exports = (emailAddress, subject, text, html) => {
  // send email via sendgrid
  const msg = {
    to: emailAddress,
    from: "admin@eventify.com",
    subject,
    text,
    html
  };
  sgMail.send(msg);
};
