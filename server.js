const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const bodyParser = require("body-parser");
clients = [];
connections = [];
const PORT = process.env.PORT || 7777;
server.listen(PORT);
console.log("SERVER STRATING...");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

function index(request, response) {
  response.sendFile(__dirname + "/index.htm");
}

function onNotify(request, response) {
  //treat post body request as notification
  const notification = request.body;

  if (notification === undefined) return;
  else {
    //notify with context attribute in message
    io.sockets.emit(notification.event, JSON.stringify(notification.message));
    //return the response to http client
    response.send(JSON.stringify(notification));

    //print to log
    console.log("notification sended with success, content:", notification);
  }
}

function onConnect(socket) {
  /**onConnect on connect to this end point
   *
   * socket with id of connected client
   */
  connections.push(socket);
  console.log(
    "Connected %s user(s)...",
    connections.length,
    "socket_id:",
    socket.id
  );
  socket.on("disconnect", function (socket) {
    connections.splice(connections.indexOf(socket), 1);
    console.log(" DECONNECTION Connected %s user(s)...", connections.length);
  });
}

io.sockets.on("connection", onConnect);
app.post("/notify", onNotify);
app.get("/", index);
