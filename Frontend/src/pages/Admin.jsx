import { useState, useEffect } from "react";
import "../App.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
    query: { isAdmin: "true" }, // Indicar que este cliente es el administrador
});

function Admin() {
    const [message, setMessage] = useState("");
    const [recipientId, setRecipientId] = useState("");
    const [connectedUsers, setConnectedUsers] = useState({}); // Objeto con IDs y nombres

    useEffect(() => {
        // Escuchar actualizaciones de usuarios conectados
        socket.on("update_users", (users) => {
            setConnectedUsers(users); // Lista actualizada desde el servidor
        });

        return () => {
            socket.off("update_users"); // Limpia los eventos al desmontar
        };
    }, []);

    const sendBroadcastMessage = () => {
        if (message.trim() !== "") {
            socket.emit("broadcast_message", message);
            setMessage(""); // Limpia el input
        }
    };

    const sendPrivateMessage = () => {
        if (message.trim() !== "" && recipientId.trim() !== "") {
            socket.emit("private_message", { message, to: recipientId });
            setMessage(""); // Limpia el input
        }
    };

    return (
        <div className="chat-container">
            <h1>Administrador</h1>
            <div className="input-container">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="message-input"
                />
                <button onClick={sendBroadcastMessage} className="send-button">
                    Enviar a Todos
                </button>
                <button onClick={sendPrivateMessage} className="send-button">
                    Enviar Privado
                </button>
            </div>
            <div className="users-container">
                <h2>Usuarios Conectados</h2>
                {Object.entries(connectedUsers).length > 0 ? (
                    Object.entries(connectedUsers).map(([id, name]) => (
                        <div key={id} className="user-item">
                            {name}{" "}
                            <button
                                onClick={() => setRecipientId(id)}
                                className="select-user-button"
                            >
                                Seleccionar
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No hay usuarios conectados.</p>
                )}
            </div>
        </div>
    );
}

export default Admin;
