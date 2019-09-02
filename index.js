const express = require("express");
const mongoose = require("mongoose");

const app = express();

const keys = require("./keys/keys");

const PORT = process.env.PORT || 5000;

const authController = require("./routes/auth");

app.use("/auth", authController);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.json({
    error: true,
    statusCode
  });
});

mongoose.connect(keys.DB_URI, { useNewUrlParser: true }, err => {
  if (err) {
    throw err;
  }
  console.log("DB connected");
  app.listen(PORT, () => {
    console.log("Server has started");
  });
});
