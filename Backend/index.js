const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"], // Admin y Cliente
        methods: ["GET", "POST"],
    },
});

const connectedClients = {}; // Almacena los usuarios conectados con sus IDs

io.on("connection", (socket) => {
    const isAdmin = socket.handshake.query.isAdmin === "true";

    if (isAdmin) {
        console.log(`Administrador conectado: ${socket.id}`);
        return; // No agrega al administrador a la lista de clientes
    }

    console.log(`Cliente conectado: ${socket.id}`);

    // Escuchar el nombre del cliente
    socket.on("set_name", (name) => {
        connectedClients[socket.id] = name || "Usuario Anónimo";
        io.emit("update_users", connectedClients); // Envía la lista actualizada con nombres
    });

    // Escuchar mensaje privado
    socket.on("private_message", ({ message, to }) => {
        if (connectedClients[to]) {
            console.log(`Mensaje privado para ${to}: ${message}`);
            io.to(to).emit("alert_message", { message, from: connectedClients[socket.id] });
        } else {
            console.log(`Usuario ${to} no encontrado.`);
        }
    });

    // Escuchar mensaje a todos
    socket.on("broadcast_message", (message) => {
        console.log(`Mensaje para todos: ${message}`);
        io.emit("alert_message", { message, from: connectedClients[socket.id] });
    });

    // Manejar desconexión
    socket.on("disconnect", () => {
        console.log(`Cliente desconectado: ${socket.id}`);
        delete connectedClients[socket.id];
        io.emit("update_users", connectedClients); // Envía la lista actualizada
    });
});



server.listen(3001, () => {
    console.log("Servidor escuchando en http://localhost:3001");
});