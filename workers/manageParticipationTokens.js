const sendEmail = require("../helpers/sendEmail");
const generateRandomToken = require("../helpers/generateRandomToken");
const generateHTMLContent = require("../helpers/generateHTMLContent");
const ParticipationToken = require("../models/ParticipationToken");
const { getClient } = require("../config/redisConfig");
const redisClient = getClient();

function generateTokenPromises(count, size) {
  const tokenPromiseArr = [];
  for (let i = 0; i < count; i++) {
    tokenPromiseArr.push(generateRandomToken(size));
  }
  return tokenPromiseArr;
}
async function generateParticipationIds(
  eventId,
  emailArr,
  size,
  { expirationDate, expirationInSeconds }
) {
  try {
    const count = emailArr.length;
    const tokenArr = await Promise.all(generateTokenPromises(count, size));
    const participationTokens = [];
    for (let i = 0; i < count; i++) {
      participationTokens.push(
        new ParticipationToken({
          token: `PI-${eventId}-${tokenArr[i]}`,
          recipient: emailArr[i],
          eventId,
          expiration: expirationDate
        })
      );
    }
    // save the tokens in redis and mongodb
    participationTokens.forEach(({ token, recipient }) => {
      redisClient.set(token, recipient, "EX", expirationInSeconds);
    });
    return await ParticipationToken.insertMany(participationTokens);
  } catch (error) {
    throw error;
  }
}

module.exports = async (event, sender, emailArr, tokenExpiration) => {
  const savedParticipationTokens = await generateParticipationIds(
    event.eventId,
    emailArr,
    2,
    tokenExpiration
  );
  const { subject, genHtml } = generateHTMLContent(event, sender);
  const htmlArr = [];
  for (let i = 0; i < emailArr.length; i++) {
    htmlArr.push(genHtml(savedParticipationTokens[i].token));
  }
  sendEmail(emailArr, subject, htmlArr);
};
