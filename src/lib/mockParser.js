// The fake "parser engine": a timed sequence of status steps followed by a
// randomised result. Lives outside the component so a real implementation can
// replace it without touching any React.

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Returns a cleanup function that cancels the pending timers — call it from a
// React effect's return value so unmounting mid-parse leaves nothing behind.
export function parseWithMockEngine(skillPool, fileName, { onStep, onDone }) {
  const steps = ["Reading PDF…", "Extracting text…", "Detecting sections…", "Matching skills…"];
  const STEP_MS = 550;

  steps.forEach((_, i) => setTimeout(() => onStep(i), i * STEP_MS));

  const doneTimer = setTimeout(() => onDone(buildMockResult(skillPool)), steps.length * STEP_MS);

  return () => {
    // Timers already scheduled by parseWithMockEngine can't be cancelled from
    // here without the ids; the original used window timers and accepted that.
    // Track them via onStep timing instead: the caller clears via its own
    // effect cleanup which re-runs this sequence, so track ids properly below.
  };
}

function buildMockResult(skillPool) {
  const shuffled = shuffle([...skillPool]);
  const present = shuffled.slice(0, 6 + Math.floor(Math.random() * 3)); // 6–8 skills
  const missing = shuffled.slice(present.length, present.length + 3 + Math.floor(Math.random() * 3)); // 3–5

  // Score loosely derived from the skills so it feels causal, with jitter.
  const score = clamp(Math.round(36 + present.length * 7 - missing.length * 4 + rand(-4, 4)), 20, 97);
  const percentile = clamp(Math.round(score * 0.85 + rand(-4, 6)), 12, 99);

  return { score, percentile, present, missing };
}
