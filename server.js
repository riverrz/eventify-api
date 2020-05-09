const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const initServer = require("./index");

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  let port;

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    port = 8000 + i + 1;
    cluster.fork({ port: port });
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  initServer(process.env.port);

  console.log(`Worker ${process.pid} started`);
}
