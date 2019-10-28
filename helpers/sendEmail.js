const sgMail = require("@sendgrid/mail");
const keys = require("../keys/keys");

sgMail.setApiKey(keys.SENDGRID_API_KEY);

module.exports = (emailArr, subject, htmlArr) => {
  // send email(s) via sendgrid

  const emails = [];
  for (let i = 0; i < emailArr.length; i++) {
    emails.push({
      to: emailArr[i],
      from: "admin@eventify.com",
      subject,
      html: htmlArr[i]
    });
  }
  sgMail.sendMultiple(emails);
};
