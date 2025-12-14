import { useState } from "react";
import Whiteboard from "../components/Whiteboard";
import Toolbar from "../components/Toolbar";
import ChatPanel from "../components/ChatPanel";
import { useSocket } from "../hooks/useSocket";

export default function Board() {
  const socket = useSocket();
  const [color, setColor] = useState("black");
  const [lines, setLines] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);

  if (!socket) {
    return <div className="container">Connecting to server...</div>;
  }

  const handleUndo = () => {
    setLines((prev) => {
      if (prev.length === 0) return prev;
      const lastLine = prev[prev.length - 1];
      setRedoStack((r) => [...r, lastLine]);
      socket.emit("draw:undo", lastLine);
      return prev.slice(0, -1);
    });
  };

  const handleRedo = () => {
    setRedoStack((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setLines((l) => [...l, last]);
      socket.emit("draw:redo", last);
      return prev.slice(0, -1);
    });
  };

  return (
    <div className="container-fluid">
      <h2 className="mb-4 fw-bold">Real-Time Collaborative Whiteboard</h2>

      <Toolbar setColor={setColor} onUndo={handleUndo} onRedo={handleRedo} />

      <div className="row">
        <div className="col-lg-9 mb-3">
          <div className="whiteboard-card">
            <Whiteboard
              socket={socket}
              color={color}
              lines={lines}
              setLines={setLines}
              setRedoStack={setRedoStack}
            />
          </div>
        </div>

        <div className="col-lg-3">
          <div className="chat-card">
            <ChatPanel socket={socket} />
          </div>
        </div>
      </div>
    </div>
  );
}
