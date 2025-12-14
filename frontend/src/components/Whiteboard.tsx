import { useRef, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";

export default function Whiteboard({
  socket,
  color,
  lines,
  setLines,
  setRedoStack,
}: any) {
  const isDrawing = useRef(false);

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

    return () => {
      socket.off("draw:start");
      socket.off("draw:update");
      socket.off("draw:undo");
      socket.off("draw:redo");
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
    if (!isDrawing.current) return;
    const pos = e.target.getStage().getPointerPosition();

    setLines((prev: any[]) => {
      const last = prev[prev.length - 1];
      const updated = { ...last, points: [...last.points, pos.x, pos.y] };
      socket.emit("draw:update", updated);
      return [...prev.slice(0, -1), updated];
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <Stage
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
    </Stage>
  );
}
