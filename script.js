// 0→Shipped Resume Parser — mock build.
// No backend: picking a file runs a fake "analysis" (a timed sequence) and
// shows randomised results. Swap buildMockResult() for a real parser later —
// everything downstream (renderResult) stays the same.

const SKILL_POOL = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL",
  "Git", "REST APIs", "Unit testing", "Docker", "CI/CD", "AWS",
  "System design", "Accessibility", "Agile", "Communication",
];

const PARSING_STEPS = [
  "Reading PDF…",
  "Extracting text…",
  "Detecting sections…",
  "Matching skills…",
];

const STEP_MS = 550;
const RING_CIRCUMFERENCE = 2 * Math.PI * 52; // r=52 in the SVG

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("file-input");
const browseBtn = document.getElementById("browse-btn");
const dropzoneIdle = document.getElementById("dropzone-idle");
const dropzoneParsing = document.getElementById("dropzone-parsing");
const parsingStatus = document.getElementById("parsing-status");
const errorEl = document.getElementById("error");
const uploadSection = document.getElementById("analyze");
const results = document.getElementById("results");
const resultsFile = document.getElementById("results-file");
const ringFg = document.getElementById("ring-fg");
const scoreValue = document.getElementById("score-value");
const scoreLabel = document.getElementById("score-label");
const scorePercentile = document.getElementById("score-percentile");
const presentSkills = document.getElementById("present-skills");
const missingSkills = document.getElementById("missing-skills");
const presentCount = document.getElementById("present-count");
const missingCount = document.getElementById("missing-count");
const againBtn = document.getElementById("again-btn");

let parsing = false;
let errorTimer;

// ---------- upload handling ----------

dropzone.addEventListener("click", () => fileInput.click());

browseBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // dropzone click would open the picker twice
  fileInput.click();
});

dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});

fileInput.addEventListener("change", () => {
  if (fileInput.files[0]) handleFile(fileInput.files[0]);
  fileInput.value = ""; // allow re-selecting the same file
});

["dragover", "drop"].forEach((ev) =>
  window.addEventListener(ev, (e) => e.preventDefault()) // stop browser opening the PDF
);

dropzone.addEventListener("dragover", () => dropzone.classList.add("dragover"));
dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
dropzone.addEventListener("drop", (e) => {
  dropzone.classList.remove("dragover");
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

function handleFile(file) {
  if (parsing) return;
  hideError();

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) return showError("That's not a PDF. Drop a .pdf resume file.");
  if (file.size > 5 * 1024 * 1024) return showError("File is over 5 MB. Try a smaller PDF.");

  startParsing(file);
}

// ---------- fake analysis ----------

function startParsing(file) {
  parsing = true;
  dropzoneIdle.classList.add("hidden");
  dropzoneParsing.classList.remove("hidden");

  PARSING_STEPS.forEach((step, i) => {
    setTimeout(() => (parsingStatus.textContent = step), i * STEP_MS);
  });

  setTimeout(() => {
    parsingStatus.textContent = "Done!";
    renderResult(buildMockResult(), file.name);
  }, PARSING_STEPS.length * STEP_MS);
}

function buildMockResult() {
  const shuffled = shuffle([...SKILL_POOL]);
  const present = shuffled.slice(0, 6 + Math.floor(Math.random() * 3));   // 6–8 skills
  const missing = shuffled.slice(present.length, present.length + 3 + Math.floor(Math.random() * 3)); // 3–5

  // Score loosely derived from the skills so it feels causal, with jitter.
  const score = clamp(Math.round(36 + present.length * 7 - missing.length * 4 + rand(-4, 4)), 20, 97);
  const percentile = clamp(Math.round(score * 0.85 + rand(-4, 6)), 12, 99);

  return { score, percentile, present, missing };
}

// ---------- rendering ----------

function renderResult(result, fileName) {
  uploadSection.classList.add("hidden");
  dropzone.classList.remove("dragover");

  resultsFile.textContent = `📄 ${fileName}`;

  scoreLabel.textContent = scoreVerdict(result.score);
  scorePercentile.textContent = `Better than ${result.percentile}% of resumes analyzed`;
  ringFg.classList.toggle("good", result.score >= 75);
  ringFg.classList.toggle("warn", result.score >= 55 && result.score < 75);
  ringFg.classList.toggle("bad", result.score < 55);

  // Animate the ring: dasharray = full circle, dashoffset shrinks to the score.
  ringFg.style.strokeDasharray = RING_CIRCUMFERENCE;
  ringFg.style.strokeDashoffset = RING_CIRCUMFERENCE;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      ringFg.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - result.score / 100);
    })
  );
  countUp(scoreValue, result.score);

  fillChips(presentSkills, presentCount, result.present, "present");
  fillChips(missingSkills, missingCount, result.missing, "missing");

  parsing = false;
  dropzoneIdle.classList.remove("hidden");
  dropzoneParsing.classList.add("hidden");

  results.classList.remove("hidden");
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

function fillChips(list, countEl, skills, kind) {
  list.innerHTML = "";
  countEl.textContent = `(${skills.length})`;
  skills.forEach((skill, i) => {
    const li = document.createElement("li");
    li.className = kind;
    li.textContent = skill;
    li.style.animationDelay = `${i * 60}ms`;
    list.appendChild(li);
  });
}

function countUp(el, target, duration = 1200) {
  const start = performance.now();
  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

againBtn.addEventListener("click", () => {
  results.classList.add("hidden");
  uploadSection.classList.remove("hidden");
  hideError();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ---------- helpers ----------

function scoreVerdict(score) {
  if (score >= 85) return "Outstanding — ship it.";
  if (score >= 70) return "Strong resume.";
  if (score >= 55) return "Decent, but the gaps are showing.";
  return "Needs work before you apply.";
}

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.remove("hidden");
  clearTimeout(errorTimer);
  errorTimer = setTimeout(hideError, 4000);
}

function hideError() {
  errorEl.classList.add("hidden");
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
