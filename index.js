const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/createRoom", (req, res) => {
  const roomId = uuidV4();

  res.redirect(`/${roomId}`);
});

app.get("/:roomId", (req, res) => {
  res.sendFile(__dirname + "/public/room.html");
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });
});
