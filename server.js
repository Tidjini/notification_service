const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const bodyParser = require("body-parser");
clients = [];
connections = [];
const PORT = process.env.PORT || 7000;
server.listen(PORT);
console.log("SERVER STRATING...");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.htm");
});

app.post("/notify", (req, res) => {
  const notification = req.body;
  if (notification === undefined) return;
  else {
    io.sockets.emit(notification.context, JSON.stringify(notification));
    res.send(JSON.stringify(notification));
    console.log("notificaiton", notification);
  }
});

let interval;
io.sockets.on("connection", function (socket) {
  connections.push(socket);
  console.log("Connected %s user(s)...", connections.length);
  socket.on("disconnect", function (socket) {
    connections.splice(connections.indexOf(socket), 1);
    console.log(" DECONNECTION Connected %s user(s)...", connections.length);
  });
  //interval = setInterval(() => getApiAndEmit(socket), 10000);
  //   socket.on("send message", function (data) {
  //     io.sockets.emit("new message", data);
  //   });
});

const getApiAndEmit = (socket) => {
  const clientNotif = {
    date: new Date(),
    entity: "CLIENT",
    data: "client data",
  };
  const magasinNotif = {
    date: new Date(),
    entity: "MAGASIN",
    data: "client data",
  };
  // Emitting a new message. Will be consumed by the client
  socket.emit("Admin", JSON.stringify(clientNotif));
  socket.emit("Admin", JSON.stringify(magasinNotif));
};
