const sendEmail = require("../helpers/sendEmail");
const generateRandomToken = require("../helpers/generateRandomToken");

module.exports = emailArr => {
  const subject = "Participation link to join the event";
  emailArr.forEach(emailAddress => {
    const participationId = `PI-${generateRandomToken(2)}`;

    const html = `<p><strong>This is your unique id for the event: ${participationId}</strong></p>
      <p><strong>PLEASE MAKE SURE YOU DO NOT SHARE THIS WITH ANYONE!</strong></p>
    `;
    sendEmail(emailAddress, subject, html);
  });
};
