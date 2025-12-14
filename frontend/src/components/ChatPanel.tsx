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

    socket.emit("chat:message", { user: username, text });
    setText("");
  };

  return (
    <div>
      <h5 className="mb-3">Live Chat</h5>

      {/* Chat Messages */}
      <div
        className="border rounded p-3 mb-3 overflow-auto"
        style={{ height: "500px" }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className="bg-light rounded px-3 py-2 mb-2"
          >
            <strong>{m.user}: </strong>
            {m.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="d-flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="form-control"
          placeholder="Type message..."
        />
        <button className="btn btn-primary" onClick={send}>
          Send
        </button>
      </div>
    </div>
  );
}
