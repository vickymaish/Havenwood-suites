import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { TextDecoder } from "node:util";

const root = process.cwd();
const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], { cwd: root })
  .toString("utf8").split("\0").filter(Boolean);
const previousClientTerms = [
  ["Ne", "val"].join(""),
  ["C", "8"].join(""),
  ["254727", "416611"].join(""),
  ["Jeff", "_Gitonga"].join(""),
  ["nevel", "-house"].join(""),
  ["Ne", "vel"].join(""),
];
const allowedDirectionsPhrase = [["Ne", "vel"].join(""), " Apartment"].join("");
const privateTillMarker = ["450", "2668"].join("");
const previousClientMatches = [];
const tillMatches = [];
const decoder = new TextDecoder("utf-8", { fatal: true });

function walk(directory) {
  if (!existsSync(directory)) return [];
  const found = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) found.push(...walk(path));
    else if (entry.isFile()) found.push(path);
  }
  return found;
}

function scanPreviousClient(relativePath, source) {
  let scanText = source;
  if (relativePath.replaceAll("\\", "/") === "data/content.ts") {
    const directions = /directions:\s*\{([\s\S]*?)\n\s*\},\s*\n\s*faqs:/.exec(source)?.[1] ?? "";
    const allowedCount = directions.split(allowedDirectionsPhrase).length - 1;
    if (allowedCount === 1 && source.split(allowedDirectionsPhrase).length - 1 === 1) {
      scanText = source.replace(allowedDirectionsPhrase, "");
    }
  }
  const normalized = relativePath.replaceAll("\\", "/");
  for (const term of previousClientTerms) {
    if (scanText.includes(term)) previousClientMatches.push(normalized);
  }
}

for (const relativePath of files) {
  const normalized = relativePath.replaceAll("\\", "/");
  if (normalized.startsWith(".next/") || normalized.startsWith("node_modules/") || normalized === "package-lock.json") continue;
  const filePath = resolve(root, relativePath);
  let bytes;
  try { bytes = readFileSync(filePath); } catch { continue; }
  if (bytes.includes(Buffer.from(privateTillMarker))) tillMatches.push(normalized);
  try { scanPreviousClient(normalized, decoder.decode(bytes)); } catch { /* Skip binary assets when checking text identifiers. */ }
}

for (const filePath of walk(resolve(root, ".next/server"))) {
  if (!filePath.toLowerCase().endsWith(".html")) continue;
  if (readFileSync(filePath).includes(Buffer.from(privateTillMarker))) tillMatches.push(filePath.slice(root.length + 1).replaceAll("\\", "/"));
}
for (const filePath of walk(resolve(root, ".next/static"))) {
  if (readFileSync(filePath).includes(Buffer.from(privateTillMarker))) tillMatches.push(filePath.slice(root.length + 1).replaceAll("\\", "/"));
}

if (previousClientMatches.length || tillMatches.length) {
  console.error("FAIL: restricted legacy or payment identifier found:");
  for (const path of previousClientMatches) console.error(`- previous-client text in ${path}`);
  for (const path of tillMatches) console.error(`- private payment data in ${path}`);
  process.exit(1);
}
console.log(`PASS: scanned ${files.length} repository files plus built HTML and static assets; no restricted values found.`);
