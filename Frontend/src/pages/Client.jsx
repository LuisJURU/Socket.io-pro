import { useEffect, useState } from "react";
import "../App.css";
import socket from "../../../Backend/socket"; // Conexión al servidor

function Client() {
    const [messages, setMessages] = useState([]); // Estado para almacenar mensajes
    const [nameSet, setNameSet] = useState(false); // Controla si ya se ingresó el nombre

    useEffect(() => {
        // Escuchar conexión inicial
        socket.on("connect", () => {
            if (!nameSet) {
                const name = prompt("Ingresa tu nombre:");
                socket.emit("set_name", name);
                setNameSet(true); // Marca que ya se ingresó el nombre
            }
        });

        // Escuchar mensajes del administrador
        socket.on("alert_message", ({ message, from }) => {
            setMessages((prevMessages) => [...prevMessages, { from, message }]); // Agregar el mensaje al estado
        });

        return () => {
            socket.off("connect");
            socket.off("alert_message");
        };
    }, [nameSet]); // Dependencia: solo se ejecutará una vez por conexión

    return (
        <div className="chat-container">
            <h1>Cliente</h1>
            <p>Conectado al servidor</p>
            <div className="messages-container">
                <h2>Mensajes Recibidos:</h2>
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index} className="message-item">
                            <strong>{msg.from}:</strong> {msg.message}
                        </div>
                    ))
                ) : (
                    <p>No hay mensajes aún...</p>
                )}
            </div>
        </div>
    );
}

export default Client;
