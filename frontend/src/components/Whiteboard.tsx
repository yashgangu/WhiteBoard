import { useRef, useEffect, useState } from "react";
import { Stage, Layer, Line, Circle, Text } from "react-konva";
import React from 'react';

interface CursorPosition {
    user: string;
    x: number;
    y: number;
}

export default function Whiteboard({
    socket,
    color,
    lines,
    setLines,
    setRedoStack,
    stageRef
}: any) {
    const isDrawing = useRef(false);
    
    const [remoteCursors, setRemoteCursors] = useState<Record<string, CursorPosition>>({});

    useEffect(() => {
        if (!socket) return;

        socket.on("draw:start", (line: any) => setLines((prev: any[]) => [...prev, line]));
        socket.on("draw:update", (line: any) => {
            setLines((prev: any[]) => {
                const copy = [...prev];
                copy[copy.length - 1] = line;
                return copy;
            });
        });
        socket.on("draw:undo", () => setLines((prev: any[]) => prev.slice(0, -1)));
        socket.on("draw:redo", (line: any) => setLines((prev: any[]) => [...prev, line]));

        socket.on("cursor:update", (cursors: Record<string, CursorPosition>) => {
            setRemoteCursors(cursors);
        });

        return () => {
            socket.off("draw:start");
            socket.off("draw:update");
            socket.off("draw:undo");
            socket.off("draw:redo");
            socket.off("cursor:update"); 
        };
    }, [socket, setLines]);

    const handleMouseDown = (e: any) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        const line = { points: [pos.x, pos.y], color, strokeWidth: 4 };

        setLines((prev: any[]) => [...prev, line]);
        setRedoStack([]);
        socket.emit("draw:start", line);
    };

    const handleMouseMove = (e: any) => {
        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();

        if (!pos) return;

        if (isDrawing.current) {
            setLines((prev: any[]) => {
                const last = prev[prev.length - 1];
                const updated = { ...last, points: [...last.points, pos.x, pos.y] };
                socket.emit("draw:update", updated);
                return [...prev.slice(0, -1), updated];
            });
        } 
        
        socket.emit("cursor:move", { x: pos.x, y: pos.y });
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    return (
        <Stage
            ref={stageRef}
            width={800}
            height={500}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <Layer>
                {lines.map((l: any, i: number) => (
                    <Line
                        key={i}
                        points={l.points}
                        stroke={l.color}
                        strokeWidth={4}
                        lineCap="round"
                        lineJoin="round"
                    />
                ))}
            </Layer>

            <Layer>
                {Object.entries(remoteCursors).map(([id, cursor]) => (
                    id !== socket.id && (
                        <React.Fragment key={id}>
                            <Circle
                                x={cursor.x}
                                y={cursor.y}
                                radius={5}
                                fill="#dc3545"
                                opacity={0.9}
                            />
                            <Text
                                x={cursor.x + 8}
                                y={cursor.y - 15}
                                text={cursor.user}
                                fontSize={14}
                                fill="#dc3545"
                                fontStyle="bold"
                            />
                        </React.Fragment>
                    )
                ))}
            </Layer>
        </Stage>
    );
}