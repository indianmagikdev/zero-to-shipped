// Throwaway diagnostic — prints the exact bytes of the first line of a file.
import { readFileSync } from "node:fs";

const target = process.argv[2];
const content = readFileSync(target, "utf8");
const firstLine = content.slice(0, content.indexOf("\n") + 1);

console.log("file:", target);
console.log("first line bytes:", JSON.stringify(firstLine));
console.log("has CRLF:", content.includes("\r\n"));
