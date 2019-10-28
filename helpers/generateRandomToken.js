// const fetch = require("node-fetch");

const randToken = require("rand-token");

module.exports = function generateToken(size) {
  return new Promise((resolve, reject) => {
    size = size || 8;
    resolve(randToken.generate(size));
  });
};

// module.exports = async function(size) {
//   try {
//     const token = await fetch(
//       "https://okaydqewkd.execute-api.ap-south-1.amazonaws.com/Prod",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           size
//         })
//       }
//     ).then(res => res.json());
//     return token;
//   } catch (err) {
//     throw err;
//   }
// };
