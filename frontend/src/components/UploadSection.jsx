import { useCallback, useEffect, useRef, useState } from "react";

import Dropzone from "./Dropzone.jsx";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function UploadSection({ onSubmitted }) {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const accept = useCallback((selectedFile) => {
    if (!selectedFile || submitting) return;

    const isPdf =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setError("That's not a PDF. Choose a .pdf resume file.");
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File is over 5 MB. Try a smaller PDF.");
      return;
    }

    setError("");
    setFile(selectedFile);
  }, [submitting]);

  const openPicker = useCallback(() => {
    if (!submitting) fileInputRef.current?.click();
  }, [submitting]);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      setDragging(false);
      accept(event.dataTransfer.files[0]);
    },
    [accept]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setDragging(false), []);

  useEffect(() => {
    const preventBrowserOpen = (event) => event.preventDefault();
    window.addEventListener("dragover", preventBrowserOpen);
    window.addEventListener("drop", preventBrowserOpen);
    return () => {
      window.removeEventListener("dragover", preventBrowserOpen);
      window.removeEventListener("drop", preventBrowserOpen);
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!file) {
      setError("Choose a resume PDF before submitting.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Paste the job description before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription.trim());

    setSubmitting(true);
    try {
      const response = await fetch("/api/analyses", {
        method: "POST",
        body: formData,
      });
      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        if (!response.ok) {
          throw new Error(
            `API returned HTTP ${response.status} without a JSON error. Check the backend and MongoDB.`
          );
        }
        throw new Error(`API returned an invalid response (HTTP ${response.status}).`);
      }

      if (!response.ok) {
        const message =
          result && typeof result === "object" && typeof result.error === "string"
            ? result.error
            : "The submission could not be saved.";
        throw new Error(
          message
        );
      }
      if (!result || typeof result !== "object" || typeof result.id !== "string") {
        throw new Error("API returned an unexpected response. The submission could not be confirmed.");
      }
      onSubmitted(result);
    } catch (submissionError) {
      setError(
        submissionError instanceof TypeError
          ? "Could not reach the API server. Start the backend and make sure MongoDB is running."
          : submissionError.message || "Could not submit the resume. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="upload-section" id="analyze">
      <form className="analysis-form" onSubmit={handleSubmit}>
        <Dropzone
          fileName={file?.name}
          stage={submitting ? "uploading" : "idle"}
          dragging={dragging}
          stepText="Submitting your resume…"
          onOpenPicker={openPicker}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            hidden
            onChange={(event) => {
              accept(event.target.files[0]);
              event.target.value = "";
            }}
          />
        </Dropzone>

        <label className="job-description-label" htmlFor="job-description">
          Job description
        </label>
        <textarea
          id="job-description"
          className="job-description"
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          maxLength={10000}
          placeholder="Paste the job description you want to compare your resume against…"
          rows={7}
          required
          disabled={submitting}
        />
        <div className="form-note">
          <span>Up to 10,000 characters</span>
          <span>{jobDescription.length}/10,000</span>
        </div>
        <p className="privacy-note">
          AI scoring is not enabled yet. Your resume PDF and job description are stored in
          MongoDB for future comparison.
        </p>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button className="submit-btn" type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit for comparison"}
        </button>
      </form>
    </section>
  );
}
