import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
    transports: ["polling"],
    upgrade: true,
    debug: true, // Activa logs de depuración
});

socket.on("connect", () => {
    console.log("Conectado con ID:", socket.id);
});



export default socket;