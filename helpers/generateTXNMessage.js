module.exports = orderStatusObj => {
  if (orderStatusObj.RESPCODE === "01") {
    return {
      success: true,
      message: orderStatusObj.RESPMSG
    };
  } else {
    return {
      error: true,
      message: orderStatusObj.RESPMSG
    };
  }
};
