const express = require("express");

const app = express();

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

app.listen(PORT, () => {
  console.log("Server has started");
});
