export default function Dropzone({ stage, dragging, stepText, onOpenPicker, children, ...dropHandlers }) {
  return (
    <div
      className={`dropzone${dragging ? " dragover" : ""}`}
      tabIndex={0}
      role="button"
      aria-label="Upload resume PDF"
      onClick={onOpenPicker}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenPicker();
        }
      }}
      {...dropHandlers}
    >
      {stage === "idle" ? (
        <div className="dropzone-idle">
          <div className="drop-icon">📄</div>
          <p className="drop-title">Drag &amp; drop your resume PDF</p>
          <p className="drop-or">or</p>
          <button
            className="browse-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // dropzone click would open the picker twice
              onOpenPicker();
            }}
          >
            Browse files
          </button>
          <p className="drop-hint">PDF only · Nothing leaves your browser — this is a mock</p>
        </div>
      ) : (
        <div className="dropzone-parsing">
          <div className="spinner"></div>
          <p className="parsing-status">{stepText}</p>
        </div>
      )}
      {children}
    </div>
  );
}
