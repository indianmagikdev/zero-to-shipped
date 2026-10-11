import { useEffect, useRef, useState } from "react";

import { RING_CIRCUMFERENCE, countUp, scoreVerdict } from "../lib/resultMotion.js";

export default function Results({ result, onAgain }) {
  const { score, percentile, present, missing } = result;

  const scoreValueRef = useRef(null);
  const [dashOffset, setDashOffset] = useState(RING_CIRCUMFERENCE); // start fully un-drawn

  // Animate the ring: dasharray = full circle, dashoffset shrinks to the score.
  // Two RAFs (the original's trick) so the "start" value paints before the end
  // value; in React the double-render of StrictMode makes it paint anyway, but
  // keep it for non-strict parity.
  useEffect(() => {
    let cancelled = false;
    let raf2 = 0;

    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (!cancelled) setDashOffset(RING_CIRCUMFERENCE * (1 - score / 100));
      });
    });

    const stop = countUp(scoreValueRef.current, score, () => {
      if (!cancelled) return false;
      return true;
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      if (stop) stop();
    };
  }, [score]);

  useEffect(() => {
    const section = document.getElementById("results");
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const ringClass = `ring-fg${score >= 75 ? " good" : score >= 55 ? " warn" : " bad"}`;

  return (
    <section className="results" id="results" aria-live="polite">
      <div className="results-file">📄 {result.fileName}</div>

      <div className="score-card">
        <div className="score-ring">
          <svg viewBox="0 0 120 120">
            <circle className="ring-bg" cx="60" cy="60" r="52" />
            <circle
              className={ringClass}
              cx="60"
              cy="60"
              r="52"
              transform="rotate(-90 60 60)"
              style={{ strokeDasharray: RING_CIRCUMFERENCE, strokeDashoffset: dashOffset }}
            />
          </svg>
          <div className="score-number">
            <span ref={scoreValueRef}>0</span>
            <span className="score-max">/100</span>
          </div>
        </div>
        <div className="score-copy">
          <h2>{scoreVerdict(score)}</h2>
          <p>{`Better than ${percentile}% of resumes analyzed`}</p>
        </div>
      </div>

      <div className="skills-grid">
        <SkillColumn kind="present" title="✅ Skills found" skills={present} />
        <SkillColumn kind="missing" title="🚩 Missing skills" skills={missing} />
      </div>

      <button className="again-btn" onClick={onAgain}>
        Analyze another resume
      </button>
    </section>
  );
}

function SkillColumn({ kind, title, skills }) {
  return (
    <div className={`skill-col ${kind}-col`}>
      <h3>
        {title} <span className="count">{`(${skills.length})`}</span>
      </h3>
      <ul className="chips">
        {skills.map((skill, i) => (
          <li key={skill} className={kind} style={{ animationDelay: `${i * 60}ms` }}>
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}
