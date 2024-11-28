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

const connectedClients = {}; // Almacena los usuarios conectados con nombres e IDs

io.on("connection", (socket) => {
  const isAdmin = socket.handshake.query.isAdmin === "true";
  const clientName =
    socket.handshake.query.name || `Cliente-${socket.id.slice(0, 4)}`;

  if (isAdmin) {
    console.log(`Administrador conectado: ${socket.id}`);
  } else {
    console.log(`Cliente conectado: ${clientName} (ID: ${socket.id})`);
    connectedClients[socket.id] = clientName; // Asocia el nombre con el ID
    io.emit("update_users", connectedClients); // Envía la lista actualizada
  }

  // Emitir mensaje de bienvenida al cliente (solo si no es administrador)
  if (!isAdmin) {
    socket.emit("alert_message", {
      message: `¡Bienvenido, ${clientName}!`,
      from: "Servidor",
    });
  }

  // Escuchar mensaje privado
  socket.on("private_message", ({ message, to }) => {
    console.log(`Mensaje privado de ${clientName} para ${connectedClients[to]}: ${message}`);
    io.to(to).emit("alert_message", { message, from: clientName });
  });

  // Escuchar mensaje a todos
  socket.on("broadcast_message", (message) => {
    console.log(`Mensaje de ${clientName} para todos: ${message}`);
    io.emit("alert_message", { message, from: clientName });
  });

  // Manejar desconexión
  socket.on("disconnect", () => {
    console.log(`${isAdmin ? "Administrador" : `Cliente (${clientName})`} desconectado (ID: ${socket.id})`);
    if (!isAdmin) {
      delete connectedClients[socket.id]; // Eliminar cliente desconectado
      io.emit("update_users", connectedClients); // Envía la lista actualizada
    }
  });
});

server.listen(3001, () => {
  console.log("Servidor escuchando en http://localhost:3001");
});
