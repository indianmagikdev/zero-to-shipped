import { useCallback, useEffect, useRef, useState } from "react";

import Dropzone from "./Dropzone.jsx";
import { parseWithMockEngine } from "../lib/mockParser.js";

const STEP_MS = 550;

export default function UploadSection({ parsingFile, onFile, onDone, skillPool }) {
  const [stage, setStage] = useState("idle"); // idle | parsing
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef(null);
  const timersRef = useRef([]);

  // The original clears `fileInput.value = ""` after every pick so selecting
  // the same file again fires change; `key` handles the rest.
  const [inputKey, setInputKey] = useState(0);

  const showError = useCallback((msg) => {
    setError(msg);
    const t = setTimeout(() => setError(null), 4000);
    timersRef.current.push(t);
  }, []);

  const openPicker = useCallback(() => {
    if (stage === "parsing") return;
    fileInputRef.current?.click();
  }, [stage]);

  const accept = useCallback(
    (file) => {
      if (!file || stage === "parsing") return;
      setInputKey((k) => k + 1); // allow re-selecting the same file

      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) return showError("That's not a PDF. Drop a .pdf resume file.");
      if (file.size > 5 * 1024 * 1024) return showError("File is over 5 MB. Try a smaller PDF.");

      setError(null);
      setStage("parsing");
      setStepIndex(0);
      onFile(file);
    },
    [stage, onFile, showError]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      accept(e.dataTransfer.files[0]);
    },
    [accept]
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault(); // stop the browser opening the PDF
    setDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setDragging(false), []);

  // Window-level prevention so the browser never opens a dropped PDF.
  useEffect(() => {
    const prevent = (e) => e.preventDefault();
    ["dragover", "drop"].forEach((ev) => window.addEventListener(ev, prevent));
    return () => ["dragover", "drop"].forEach((ev) => window.removeEventListener(ev, prevent));
  }, []);

  // The fake analysis: step through the status lines, then hand the result up.
  useEffect(() => {
    if (stage !== "parsing" || !parsingFile) return;

    parseWithMockEngine(skillPool, parsingFile.name, {
      onStep: (i) => setStepIndex(i),
      onDone: (mockResult) => onDone(mockResult),
    });

    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, parsingFile?.name]);

  useEffect(() => () => clearTimers(), []);

  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  const steps = ["Reading PDF…", "Extracting text…", "Detecting sections…", "Matching skills…", "Done!"];
  const visibleStep = stage === "parsing" ? Math.min(stepIndex, steps.length - 1) : 0;

  return (
    <section className="upload-section" id="analyze">
      <Dropzone
        stage={stage}
        dragging={dragging}
        stepText={steps[visibleStep]}
        onOpenPicker={openPicker}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <input
          ref={fileInputRef}
          key={inputKey}
          type="file"
          accept="application/pdf,.pdf"
          hidden
          onChange={(e) => accept(e.target.files[0])}
        />
      </Dropzone>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
