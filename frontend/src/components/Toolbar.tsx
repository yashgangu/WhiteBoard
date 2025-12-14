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
        <div className="sticky-top bg-white py-4 border-bottom shadow-sm z-3">
            <div className="container-fluid d-flex flex-wrap justify-content-center justify-content-md-start align-items-center">

                <div className="btn-group me-4 mb-2 mb-md-0 border rounded-3 overflow-hidden" role="group" aria-label="Color Selection">

                    <span className="btn btn-light disabled fw-bold py-2 px-3">
                        <i className="bi bi-palette-fill me-2"></i> Color:
                    </span>

                    {['black', 'red', 'blue', 'green'].map(c => (
                        <button
                            key={c}
                            className={`btn p-0`}
                            style={{ 
                                backgroundColor: c, 
                                width: '40px', 
                                height: '40px',
                                border: `3px solid ${c === 'black' ? '#00000030' : 'transparent'}`, 
                            }}
                            onClick={() => setColor(c)}
                            title={`Set color to ${c}`}
                        ></button>
                    ))}
                </div>

                <div className="btn-group me-4 mb-2 mb-md-0 shadow-sm" role="group" aria-label="History Actions">
                    <button className="btn btn-outline-warning" onClick={onUndo} title="Undo Last Action">
                        <i className="bi bi-arrow-counterclockwise me-1"></i> Undo
                    </button>
                    <button className="btn btn-outline-success" onClick={onRedo} title="Redo Last Action">
                        Redo <i className="bi bi-arrow-clockwise ms-1"></i>
                    </button>
                </div>

                <button className="btn btn-primary mb-2 mb-md-0 shadow-sm" onClick={onSave} title="Save Whiteboard as PNG">
                    <i className="bi bi-download me-1"></i> Export Image
                </button>
            </div>
        </div>
    );
}