const Module = require("../models/Module");

exports.postModule = async (req, res, next) => {
  try {
    const { name, banner } = req.body;
    const newModule = new Module({ name, banner });
    newModule.save();
    res.json(true);
  } catch (error) {
    next(error);
  }
};
