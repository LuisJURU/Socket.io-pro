import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:3001", {
  transports: ["polling"],
  upgrade: true, // Permite actualizar de Polling a WebSocket
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

    socket.on("connect_error", (err) => {
      console.error("Error de conexión:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("Desconectado del servidor:", reason);
    });


  }, []);


  useEffect(() => {
    // Escuchar mensajes del servidor
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => {
      socket.off("message"); // Elimina el evento 'message' al desmontar
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const messageData = {
        id: socket.id, // Identificador único del cliente
        text: message, // Texto del mensaje
      };
      socket.emit("message", messageData); // Enviar mensaje al servidor
      setMessage(""); // Limpiar el input
    }


  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage(); // Llama a la función de enviar mensaje
    }
  };



  return (
    <div className="chat-container">
      <h1>Chat con Socket.IO</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.id === socket.id ? "sent" : "received"
              }`}
          >
            {msg.text}
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
    </div>
  );
}

export default App;
