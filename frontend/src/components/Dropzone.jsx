export default function Dropzone({
  fileName,
  stage,
  dragging,
  stepText,
  onOpenPicker,
  children,
  ...dropHandlers
}) {
  return (
    <div
      className={`dropzone${dragging ? " dragover" : ""}`}
      onClick={onOpenPicker}
      {...dropHandlers}
    >
      {stage === "idle" ? (
        <div className="dropzone-idle">
          <div className="drop-icon">📄</div>
          <p className="drop-title">{fileName || "Drag & drop your resume PDF"}</p>
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
          <p className="drop-hint">PDF only · Maximum file size 5 MB</p>
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
