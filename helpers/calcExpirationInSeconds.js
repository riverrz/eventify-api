module.exports = (start, end) => {
  return (end.getTime() - start.getTime()) / 1000;
};
