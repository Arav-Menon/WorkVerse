import { WebSocketServer } from "ws";

const PORT = Number(process.env.PORT || 8080);

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (socket) => {
  socket.send("connection is made!");
});
console.table(`Server is running on ${PORT}`)