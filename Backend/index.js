const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
    allowUpgrades: true,
});

io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on("message", (data) => {
        console.log(`Mensaje recibido de ${data.username}: ${data.text}`);
        io.emit("message", data); // Reenviar mensaje con username
    });

    socket.on("disconnect", (reason) => {
        console.log(`Cliente desconectado: ${socket.id}, Razón: ${reason}`);
    });
});

app.get("/", (req, res) => {
    res.send("Socket.IO Server is Running");
});

server.listen(3001, () => {
    console.log("Servidor de Socket.IO escuchando en http://localhost:3001");
});
