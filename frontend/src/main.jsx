import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "../styles.css";

// StrictMode double-mounts components in dev to surface missing cleanup —
// every effect in this app cleans up after itself, so it's safe to keep.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
