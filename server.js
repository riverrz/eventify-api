const cluster = require("cluster"); // Only required if you want the worker id
const http = require("http");
const sticky = require("./lib/sticky-session/");
const initServer = require("./index");



if(process.env.NODE_ENV === "production") {
  const server = http.createServer(function (req, res) {
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
  }
} else {
  initServer(8001);
}
