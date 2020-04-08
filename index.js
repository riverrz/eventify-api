const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("dotenv").config();
const Agenda = require("./agenda");
const { redisInit } = require("./config/redisConfig");
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/event");
const tokenRoutes = require("./routes/token");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");

const callBackRoutes = require("./routes/callBack");

const loadModulesInRedis = require("./helpers/loadModulesInRedis");

const app = express();
redisInit();

const keys = require("./keys");

const PORT = process.env.PORT || 5000;

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/auth", authRoutes);
app.use("/event", eventRoutes);
app.use("/token", tokenRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/callback", callBackRoutes);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    error: true,
    message: error.message,
  });
});

mongoose.connect(
  keys.DB_URI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) {
      throw err;
    }
    console.log("DB connected");
    app.listen(PORT, async () => {
      loadModulesInRedis();
      await Agenda.start();
      console.log(`Server has started on Port ${PORT}`);
    });
  }
);
