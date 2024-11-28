import { useState, useEffect } from "react";
import "../App.css";
import { io } from "socket.io-client";

function Client() {
    const [name, setName] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState(null);

    // Conectar con el nombre del cliente
    const connectWithName = () => {
        if (!name.trim()) {
            alert("Por favor, ingresa un nombre válido.");
            return;
        }

        // Desconectar el socket anterior si existe
        if (socket) {
            socket.disconnect();
        }

        // Crear una nueva conexión de socket
        const newSocket = io("http://localhost:3001", {
            query: { name }, // Enviar el nombre como parte de la conexión
        });

        // Configurar eventos del socket
        newSocket.on("connect", () => {
            console.log(`Conectado al servidor con ID: ${newSocket.id}`);
            setIsConnected(true);
        });

        newSocket.on("alert_message", ({ message, from }) => {
            alert(`Mensaje de ${from}: ${message}`);
        });

        newSocket.on("disconnect", () => {
            console.log("Desconectado del servidor");
            setIsConnected(false);
        });

        // Guardar el socket en el estado
        setSocket(newSocket);
    };

    // Limpieza del socket al desmontar
    useEffect(() => {
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [socket]);

    return (
        <div className="chat-container">
            {!isConnected ? (
                <div className="name-form">
                    <h1>Ingresa tu nombre</h1>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre"
                        className="name-input"
                    />
                    <button onClick={connectWithName} className="connect-button">
                        Conectar
                    </button>
                </div>
            ) : (
                <div>
                    <h1>Cliente: {name}</h1>
                    <p>Esperando mensajes del administrador...</p>
                </div>
            )}
        </div>
    );
}

export default Client;
