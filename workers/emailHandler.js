const sendEmail = require("../helpers/sendEmail");

module.exports = emailArr => {
  emailArr.forEach(emailAddress => {
    sendEmail(emailAddress);
  });
};
