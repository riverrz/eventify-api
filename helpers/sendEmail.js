const sgMail = require("@sendgrid/mail");
const Event = require("../models/Event");
const keys = require("../keys");
const { reminderEmailContent } = require("../helpers/generateHTMLContent");

sgMail.setApiKey(keys.SENDGRID_API_KEY);

const sendEmail = (emailArr, subject, htmlArr) => {
  // send email(s) via sendgrid

  const emails = [];
  for (let i = 0; i < emailArr.length; i++) {
    emails.push({
      to: emailArr[i],
      from: "admin@eventify.com",
      subject:
        typeof subject === "string"
          ? subject
          : Array.isArray(subject)
          ? subject[i]
          : "",
      html: htmlArr[i],
    });
  }
  sgMail.sendMultiple(emails);
};

const sendReminders = async (event) => {
  const emailArr = [];
  const subjectArr = [];
  const htmlArr = [];
  event.participants.forEach(({ username, email }) => {
    const { subject, html } = reminderEmailContent(event, username);
    subjectArr.push(subject);
    htmlArr.push(html);
    emailArr.push(email);
  });

  sendEmail(emailArr, subjectArr, htmlArr);
};

exports.sendReminders = sendReminders;
exports.sendEmail = sendEmail;
