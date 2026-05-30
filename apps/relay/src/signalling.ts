import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 5000 });

wss.on("connection", (socket) => {
    socket.on("message", (data) => {
        console.log(data.toString())
    })
})