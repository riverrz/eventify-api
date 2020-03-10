module.exports = (start, end) => {
  return {
    expirationDate: end,
    expirationInSeconds: end.getTime() / 1000
  };
};
