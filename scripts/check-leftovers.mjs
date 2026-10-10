import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { TextDecoder } from "node:util";

const root = process.cwd();
const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], { cwd: root })
  .toString("utf8").split("\0").filter(Boolean);
const excluded = new Set(["package-lock.json", "scripts/check-leftovers.mjs"]);
const terms = [
  ["Ne", "vel"].join(""),
  ["Ne", "val"].join(""),
  "C8",
  "254727416611",
  "+254 727",
  ["victormureithi957", "@gmail.com"].join(""),
  "Jeff_Gitonga",
  ["nevel", "-house"].join(""),
];
const decoder = new TextDecoder("utf-8", { fatal: true });
const matches = [];

for (const relativePath of files) {
  const normalized = relativePath.replaceAll("\\", "/");
  if (excluded.has(normalized) || normalized.startsWith(".test-out/") || normalized.startsWith(".git/") || normalized.startsWith("node_modules/") || normalized.startsWith(".next/")) continue;
  let content;
  try { content = decoder.decode(readFileSync(resolve(root, relativePath))); }
  catch { continue; }
  for (const term of terms) if (content.toLowerCase().includes(term.toLowerCase())) matches.push({ path: normalized, term });
}

if (matches.length) {
  console.error("FAIL: previous-client identifiers remain:");
  for (const match of matches) console.error(`- ${match.path}: ${match.term}`);
  process.exit(1);
}
console.log(`PASS: scanned ${files.length} repository files; no previous-client identifiers found.`);
