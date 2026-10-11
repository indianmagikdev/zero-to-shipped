// 0→Shipped Resume Parser — mock build (React).
// No backend: picking a file runs a fake "analysis" (a timed sequence) and
// shows randomised results. Swap buildMockResult() for a real parser later —
// everything downstream (the results section) stays the same.

import { useCallback, useEffect, useRef, useState } from "react";

import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import UploadSection from "./components/UploadSection.jsx";
import Results from "./components/Results.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Footer from "./components/Footer.jsx";

const SKILL_POOL = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL",
  "Git", "REST APIs", "Unit testing", "Docker", "CI/CD", "AWS",
  "System design", "Accessibility", "Agile", "Communication",
];

export default function App() {
  // Which screen is showing: the upload dropzone, or the parsed results.
  const [screen, setScreen] = useState("upload");
  const [parsingFile, setParsingFile] = useState(null); // { name }
  const [result, setResult] = useState(null);           // { score, percentile, present, missing }

  const handleFile = useCallback((file) => {
    setResult(null);
    setParsingFile({ name: file.name });
  }, []);

  const handleDone = useCallback((mockResult) => {
    setResult(mockResult);
    setParsingFile(null);
    setScreen("results");
  }, []);

  const handleAgain = useCallback(() => {
    setResult(null);
    setScreen("upload");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        {screen === "upload" && (
          <UploadSection parsingFile={parsingFile} onFile={handleFile} onDone={handleDone} skillPool={SKILL_POOL} />
        )}
        {screen === "results" && result && <Results result={result} onAgain={handleAgain} />}
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
