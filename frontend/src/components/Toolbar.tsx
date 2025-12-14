
export default function Toolbar({
  setColor,
  onUndo,
  onRedo
}: {
  setColor: (color: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
}) {
  return (
    <div className="toolbar-wrapper">
      <div
        className="color-button"
        style={{ background: "black" }}
        onClick={() => setColor("black")}
      />
      <div
        className="color-button"
        style={{ background: "red" }}
        onClick={() => setColor("red")}
      />
      <div
        className="color-button"
        style={{ background: "blue" }}
        onClick={() => setColor("blue")}
      />
      <div
        className="color-button"
        style={{ background: "green" }}
        onClick={() => setColor("green")}
      />
      <button className="btn btn-warning ms-2" onClick={onUndo}>
        Undo
      </button>
      <button className="btn btn-success ms-2" onClick={onRedo}>
        Redo
      </button>
    </div>
  );
}
