const fetch = require("node-fetch");
const { verifychecksum } = require("../config/checksum");
const generateTXNMessage = require("../helpers/generateTXNMessage");
const keys = require("../keys");

exports.postHandleTransaction = async (req, res, next) => {
  const responseBody = req.body;
  // verify checksum
  if (verifychecksum(responseBody, keys.PAYTM_MERCHANT_KEY)) {
    // Checksum is not tempered
    console.log("Verified Checksum");
    // Reverify status with Transaction Status API
    try {
      const statusObj = await fetch(keys.PAYTM_STATUS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          MID: keys.MID,
          ORDERID: responseBody.ORDERID,
          CHECKSUMHASH: responseBody.CHECKSUMHASH
        })
      }).then(res => res.json());
      const { TXNID, BANKTXNID, TXNDATE, STATUS } = statusObj;

      // Update the order's details.
      const foundOrder = await Order.findOne({
        orderId: statusObj.ORDERID
      });
      if (!foundOrder) {
        const error = new Error("Order not found!");
        error.statusCode = 500;
        return next(error);
      }
      if (foundOrder.STATUS !== "PENDING") {
        const error = new Error("Txn has already being completed!");
        error.statusCode = 403;
        return next(error);
      }
      foundOrder.TXNID = TXNID;
      foundOrder.BANKTXNID = BANKTXNID;
      foundOrder.TXNDATE = new Date(TXNDATE);
      foundOrder.STATUS = STATUS;
      await foundOrder.save();

      const txnResultObj = generateTXNMessage(statusObj);
      if (txnResultObj.error) {
        return res.json(txnResultObj);
      }

      // Find the Student to update the balance.
      const foundStudent = await Student.findOne({
        studentId: foundOrder.sender
      });
      if (!foundStudent) {
        const error = new Error("Student id received in order is invalid!");
        error.statusCode = 404;
        return next(error);
      }

      // Initialise the newStudentBalance(used for updation) variable with current balance.
      let newStudentBalance = foundStudent.balance;

      // Update the Student's balance appropriately.
      // Check whether the vendor is Prime Vendor.
      const isPrimeVendor = await PrimeVendor.findOne({
        vendorId: foundOrder.receiver
      });

      // If primeVendor (i.e. it must be for adding money), then add the equivalent SCoins.
      if (isPrimeVendor) {
        // Get equivalent amount of SCoins based on order's totalPrice(i.e how much money to be added).
        newStudentBalance += foundOrder.totalPrice;
      }

      // Update the balance
      await foundStudent.updateBalance(newStudentBalance);

      // Send response to client based on RESPCODE
      res.json(txnResultObj);
    } catch (error) {
      next(error);
    }
  } else {
    // Checksum is tempered
    console.log("Checksum not verified");
    const error = new Error("Checksum not verified");
    error.statusCode = 400;
    next(error);
  }
};
