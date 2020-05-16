const { flatten } = require("ramda");

module.exports = (...fns) => (...args) => {
  fns = flatten(fns);
  fns.forEach((fn) => fn && fn(...args));
};
