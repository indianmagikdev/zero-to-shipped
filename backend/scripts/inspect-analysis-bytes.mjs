// Throwaway diagnostic — prints the exact bytes around the "status:" field of Analysis.js.
import { readFileSync } from "node:fs";

const content = readFileSync("backend/models/Analysis.js", "utf8");
const index = content.indexOf("status:");
const around = content.slice(index - 2, index + 220);

console.log("bytes around 'status:':", JSON.stringify(around));
