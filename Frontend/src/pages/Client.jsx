import { useEffect } from "react";
import "../App.css";
import socket from "../../../Backend/socket";

function Client() {
    useEffect(() => {
        // Pedir el nombre del cliente
        const name = prompt("Ingresa tu nombre:");
        socket.emit("set_name", name);

        // Escuchar mensajes del administrador
        socket.on("alert_message", ({ message, from }) => {
            alert(`Mensaje de ${from}: ${message}`);
        });

        return () => {
            socket.off("alert_message");
        };
    }, []);

    return (
        <div className="chat-container">
            <h1>Cliente</h1>
            <p>Esperando mensajes del administrador...</p>
        </div>
    );
}

export default Client;
