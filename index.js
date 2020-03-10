const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const { redisInit } = require("./config/redisConfig");

const app = express();
redisInit();

const keys = require("./keys/keys");

const PORT = process.env.PORT || 5000;

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/event");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/auth", authRoutes);
app.use("/event", eventRoutes);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    error: true,
    message: error.message
  });
});

mongoose.connect(
  keys.DB_URI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  err => {
    if (err) {
      throw err;
    }
    console.log("DB connected");
    app.listen(PORT, () => {
      console.log(`Server has started on Port ${PORT}`);
    });
  }
);
