const app = require("express")();
const server = require("http").Server(app);
const WebSocket = require("./websockets");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("dotenv").config();

// initialising Agenda jobs
const Agenda = require("./agenda");
const InitJobs = require("./agenda/jobs");

const { redisInit } = require("./config/redisConfig");

// Routes
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/event");
const tokenRoutes = require("./routes/token");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const callBackRoutes = require("./routes/callBack");

const keys = require("./keys");

const loadModulesInRedis = require("./helpers/loadModulesInRedis");

// initialisze redis
redisInit();

// PORT
const PORT = process.env.PORT || 5000;

// initialising websocket
WebSocket.init(server);

// Express middlewares
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
  console.log(error.message);
  res.status(statusCode).json({
    error: true,
    message: error.message,
  });
});

// Connecting to mongodb
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
    server.listen(PORT, async () => {
      loadModulesInRedis();
      await Agenda.start();
      InitJobs(Agenda);
      console.log(`Server has started on Port ${PORT}`);
    });
  }
);
