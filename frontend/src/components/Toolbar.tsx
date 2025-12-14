export default function Toolbar({
  setColor,
  onUndo,
  onRedo,
  onSave
}: {
  setColor: (color: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
}) {
  return (
    <div className="sticky-top bg-white border-bottom shadow-sm z-3">
      <div className="container-fluid py-3 d-flex flex-wrap align-items-center gap-3">

        {/* Color Picker */}
        <div className="d-flex align-items-center gap-2 border rounded-3 px-3 py-2 shadow-sm bg-light">
          <span className="fw-semibold text-secondary small">
            <i className="bi bi-brush-fill me-1"></i> Draw
          </span>

          {["black", "red", "blue", "green"].map((c) => (
            <button
              key={c}
              className="btn p-0 rounded-circle border d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: c,
                width: 36,
                height: 36
              }}
              onClick={() => setColor(c)}
              title={`Select ${c} color`}
            >
              <i className="bi bi-circle-fill text-white small"></i>
            </button>
          ))}
        </div>

        {/* Undo / Redo */}
        <div className="btn-group shadow-sm">
          <button
            className="btn btn-outline-secondary"
            onClick={onUndo}
            title="Undo"
          >
            <i className="bi bi-arrow-counterclockwise me-1"></i>
            Undo
          </button>

          <button
            className="btn btn-outline-secondary"
            onClick={onRedo}
            title="Redo"
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Redo
          </button>
        </div>

        {/* Save */}
        <button
          className="btn btn-primary shadow-sm ms-auto"
          onClick={onSave}
          title="Save Whiteboard"
        >
          <i className="bi bi-download me-2"></i>
          Export PNG
        </button>
      </div>
    </div>
  );
}
