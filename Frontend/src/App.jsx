import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:3001", {
    transports: ["polling"],
    upgrade: true,
});

function App() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [isUsernameSet, setIsUsernameSet] = useState(false);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Conexión establecida con el servidor:", socket.id);
        });

        socket.on("message", (data) => {
            setMessages((prev) => [...prev, data]); // Agregar mensaje recibido
        });

        socket.on("disconnect", (reason) => {
            console.log("Desconectado del servidor:", reason);
        });

        return () => {
            socket.off("message");
        };
    }, []);

    const sendMessage = () => {
        if (message.trim() !== "" && username.trim() !== "") {
            const messageData = {
                id: socket.id, // ID del cliente
                username, // Nombre del usuario
                text: message, // Contenido del mensaje
            };
            socket.emit("message", messageData); // Enviar mensaje al servidor
            setMessage(""); // Limpiar el input
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    const setUser = () => {
        if (username.trim() !== "") {
            setIsUsernameSet(true); // Marca que el nombre ha sido configurado
        }
    };

    return (
        <div className="chat-container">
            {!isUsernameSet ? (
                <div className="username-container">
                    <h2>Ingresa tu nombre</h2>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Tu nombre"
                        className="username-input"
                    />
                    <button onClick={setUser} className="set-username-button">
                        Confirmar
                    </button>
                </div>
            ) : (
                <>
                    <h1>Chat con Socket.IO</h1>
                    <div className="chat-box">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`message ${
                                    msg.id === socket.id ? "sent" : "received"
                                }`}
                            >
                                <strong>{msg.username}:</strong> {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="input-container">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Escribe un mensaje..."
                            className="message-input"
                        />
                        <button onClick={sendMessage} className="send-button">
                            Enviar
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;
