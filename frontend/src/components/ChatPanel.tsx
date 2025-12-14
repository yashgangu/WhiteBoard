import { useState, useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";

export default function ChatPanel({ socket }: any) {
  const { keycloak } = useKeycloak();
  const username = keycloak.tokenParsed?.preferred_username || "Unknown";

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!socket) return;

    socket.on("chat:message", (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("chat:message");
  }, [socket]);

  const send = () => {
    if (!text.trim()) return;

    const msg = {
      user: username, 
      text,
    };

    socket.emit("chat:message", msg);
    setText("");
  };

  return (
    <div>
      <h5 className="mb-3">Live Chat</h5>

      <div className="chat-container">
        {messages.map((m, i) => (
          <div key={i} className="chat-message">
            <strong>{m.user}: </strong>
            {m.text}
          </div>
        ))}
      </div>

      <div className="chat-input-box">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="form-control"
          placeholder="Type message..."
        />
        <button className="btn btn-primary ms-2" onClick={send}>
          Send
        </button>
      </div>
    </div>
  );
}
