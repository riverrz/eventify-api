const jwt = require("jsonwebtoken");
const keys = require("../keys/keys");

exports.genToken = function(payload) {
  return new Promise(function(resolve, reject) {
    jwt.sign(payload, keys.SECRET, function(err, token) {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

exports.verifyToken = function(token) {
  try {
    return jwt.verify(token, keys.SECRET);
  } catch (error) {
    return { error: true, message: error.message };
  }
};
