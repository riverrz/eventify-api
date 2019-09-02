exports.getCurrent = (req, res, next) => {
  res.json({
    success: true,
    user: req.user
  });
};
