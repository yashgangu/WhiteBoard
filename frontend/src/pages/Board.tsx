import { useState, useRef } from "react";
import Whiteboard from "../components/Whiteboard";
import Toolbar from "../components/Toolbar";
import ChatPanel from "../components/ChatPanel";
import { useSocket } from "../hooks/useSocket";
import { useKeycloak } from "@react-keycloak/web";

export default function Board() {
  const socket = useSocket();
  const stageRef = useRef<any>(null);

  const [color, setColor] = useState("black");
  const [lines, setLines] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);

  const { keycloak } = useKeycloak();
  const username = keycloak.tokenParsed?.preferred_username || "Guest";

  const handleSave = () => {
    if (!stageRef.current) return;

    const dataURL = stageRef.current.toDataURL({
      mimeType: "image/png",
      quality: 1,
    });

    const link = document.createElement("a");
    link.download = `whiteboard-${username}-${new Date()
      .toISOString()
      .substring(0, 10)}.png`;
    link.href = dataURL;
    link.click();
  };

  if (!socket) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="fw-semibold text-secondary">
            <i className="bi bi-wifi me-2"></i>
            Connecting to collaboration server…
          </p>
        </div>
      </div>
    );
  }

  const handleUndo = () => {
    setLines((prev) => {
      if (!prev.length) return prev;
      const last = prev[prev.length - 1];
      setRedoStack((r) => [...r, last]);
      socket.emit("draw:undo", last);
      return prev.slice(0, -1);
    });
  };

  const handleRedo = () => {
    setRedoStack((prev) => {
      if (!prev.length) return prev;
      const last = prev[prev.length - 1];
      setLines((l) => [...l, last]);
      socket.emit("draw:redo", last);
      return prev.slice(0, -1);
    });
  };

  return (
    <div className="min-vh-100 bg-light">

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4">
        <span className="navbar-brand fw-bold text-primary fs-4">
          <i className="bi bi-easel2-fill me-2"></i>
          Collaborative Whiteboard
        </span>

        <div className="ms-auto d-flex align-items-center gap-3">
          <span className="text-secondary small">
            <i className="bi bi-person-circle me-1"></i>
            {username}
          </span>
        </div>
      </nav>

      {/* Toolbar */}
      <div className="bg-white border-bottom shadow-sm sticky-top">
        <div className="container py-3">
          <Toolbar
            setColor={setColor}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onSave={handleSave}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container-fluid py-4">
        <div className="row g-4">

          {/* Whiteboard */}
          <div className="col-lg-9 col-12">
            <div className="card shadow border-0 rounded-4 h-100">
              <div className="card-header bg-white border-0 fw-semibold">
                <i className="bi bi-brush-fill me-2 text-primary"></i>
                Drawing Canvas
              </div>

              <div className="card-body d-flex justify-content-center align-items-center">
                <div
                  className="bg-white border rounded-3 shadow-sm"
                  style={{ width: 800, height: 500 }}
                >
                  <Whiteboard
                    socket={socket}
                    color={color}
                    lines={lines}
                    setLines={setLines}
                    setRedoStack={setRedoStack}
                    stageRef={stageRef}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="col-lg-3 col-12">
            <div className="card shadow border-0 rounded-4 h-100">
              <div className="card-header bg-white border-0 fw-semibold">
                <i className="bi bi-chat-left-text-fill me-2 text-success"></i>
                Team Chat
              </div>

              <div className="card-body p-3 d-flex flex-column">
                <ChatPanel socket={socket} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
