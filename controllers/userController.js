const keys = require("../keys");
const checksum = require("../config/checksum");
const Order = require("../models/Order");
const generateRandomToken = require("../helpers/generateRandomToken");

exports.patchBalance = async (req, res, next) => {
  // VALIDATE USER INPUT
  try {
    const totalPrice = Number(req.body.topUp);

    const order = new Order({
      totalPrice,
      author: req.user.userId,
    });
    order.orderId = "O-" + (await generateRandomToken(12));
    const TXN_AMOUNT = String(totalPrice);

    const orderObj = {
      ORDER_ID: order.orderId,
      CUST_ID: order.author,
      TXN_AMOUNT,
      MID: keys.MID,
      CHANNEL_ID: keys.CHANNEL_ID,
      WEBSITE: keys.WEBSITE,
      MOBILE_NO: req.user.phone,
      EMAIL: req.user.email,
      INDUSTRY_TYPE_ID: keys.INDUSTRY_TYPE_ID,
      CALLBACK_URL: keys.CALLBACK_URL,
    };

    // Convert to array with keys
    const orderArr = [];
    for (name in orderObj) {
      orderArr[name] = orderObj[name];
    }
    checksum.genchecksum(
      orderArr,
      keys.PAYTM_MERCHANT_KEY,
      async (err, params) => {
        if (err) {
          return next(err);
        }
        orderObj.CHECKSUMHASH = params.CHECKSUMHASH;
        try {
          await order.save();
          res.json({
            orderObj,
          });
        } catch (error) {
          next(error);
        }
      }
    );
  } catch (error) {
    next(error);
  }
};
