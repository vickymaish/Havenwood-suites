import { spawn } from "node:child_process";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const testDir = join(process.cwd(), ".test-out", "tests");
const files = (await readdir(testDir)).filter((file) => file.endsWith(".test.js")).map((file) => join(testDir, file));
if (!files.length) {
  console.error("No compiled test files found. Check tsconfig.test.json.");
  process.exit(1);
}
const child = spawn(process.execPath, ["--test", ...files], { stdio: "inherit" });
child.once("error", (error) => { console.error(error); process.exit(1); });
child.once("exit", (code, signal) => process.exit(code ?? (signal ? 1 : 0)));
