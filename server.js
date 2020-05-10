const cluster = require("cluster"); // Only required if you want the worker id
const sticky = require("./lib/sticky-session/");
const initServer = require("./index");

const server = require("http").createServer(function (req, res) {
  res.end("worker: " + cluster.worker.id);
});

//sticky.listen() will return false if Master
if (!sticky.listen(server, 8000)) {
  // Master code
  server.once("listening", function () {
    console.log("server started on 8000 port");
  });
} else {
  // Worker code
  initServer(process.env.port);

  // console.log(`Worker ${process.pid} started at port ${process.env.port}`);
}

// const cluster = require("cluster");
// const numCPUs = require("os").cpus().length;
// const initServer = require("./index");

// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`);
//   let port;

//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     port = 8000 + i;
//     cluster.fork({ port: port });
//   }
//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//   });
// } else {
// initServer(process.env.port);

// console.log(`Worker ${process.pid} started`);
// }
