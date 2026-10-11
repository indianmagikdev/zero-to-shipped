// Reads the downloaded Vercel config schema and reports which keys it knows.
// Throwaway diagnostic script — delete after use.
import { readFileSync } from "node:fs";

const schema = JSON.parse(readFileSync("vercel-schema.json", "utf8"));
const props = schema.properties || {};

console.log("root title:", schema.title);
console.log("has 'services' at root:", "services" in props);
console.log("has 'entrypoint' at root:", "entrypoint" in props);

const frameworks = props.framework?.enum || [];
console.log("'express' is a valid framework:", frameworks.includes("express"));
console.log("first 40 framework values:", frameworks.slice(0, 40).join(", "));

const knownRootKeys = Object.keys(props);
console.log("\nroot keys the schema DOES know:", knownRootKeys.join(", "));
