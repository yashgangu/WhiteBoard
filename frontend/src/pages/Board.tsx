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
        if (stageRef.current) {
        
            const dataURL = stageRef.current.toDataURL({
                mimeType: 'image/png',
                quality: 1,
            });

            const link = document.createElement('a');
            
            link.download = `whiteboard-${username}-${new Date().toISOString().substring(0, 10)}.png`; 
            link.href = dataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (!socket) {
        
        return <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="spinner-grow text-primary me-3" role="status"></div>
            <p className="lead fw-bold mb-0">Connecting to Real-Time Server...</p>
        </div>;
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
        
        <div className="d-flex flex-column min-vh-100 bg-light">
            
            {}
            <Toolbar 
                setColor={setColor} 
                onUndo={handleUndo} 
                onRedo={handleRedo} 
                onSave={handleSave} 
            />

            {}
            <div className="container-fluid p-4 flex-grow-1">
                
                {}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-light text-dark mb-0 fs-5">
                        <i className="bi bi-person-circle me-2 text-primary"></i>
                        Collaborating as: <span className="fw-bold">{username}</span>
                    </h2>
                </div>

                <div className="row g-4 h-100">
                    
                    {}
                    <div className="col-lg-9 col-12 order-lg-1 order-2">
                        {}
                        <div className="card shadow-lg h-100 border-0">
                            <div className="card-header bg-white border-bottom">
                                <h4 className="card-title mb-0 text-secondary fs-6">
                                    <i className="bi bi-vector-pen me-2"></i>Drawing Canvas
                                </h4>
                            </div>
                            <div className="card-body p-0 d-flex justify-content-center align-items-center">
                                {}
                                <div className="bg-white border shadow-sm" style={{ width: 800, height: 500, border: '1px solid #eee' }}>
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

                    {}
                    <div className="col-lg-3 col-12 order-lg-2 order-1">
                        <div className="card shadow-sm h-100">
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