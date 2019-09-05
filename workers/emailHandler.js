const sendEmail = require("../helpers/sendEmail");
const keys = require("../keys/keys");
const generateRandomToken = require("../helpers/generateRandomToken");

module.exports = (emailArr, verifyToken) => {
  const subject = "Participation Link to join the event";
  const text = "Confirm your participation by clicking the link below:";
  emailArr.forEach(emailAddress => {
    const html = `<a href=${keys.PARTICIPATION_LINK_DOMAIN +
      `?email=${emailAddress}&token=VT-${generateRandomToken(6)}`}>`;
    sendEmail(emailAddress, subject, text, html);
  });
};
