import { spawn } from "node:child_process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
for (const script of ["lint", "test", "check:leftovers", "build"]) {
  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(npm, ["run", script], { stdio: "inherit", shell: process.platform === "win32" });
    child.once("error", reject);
    child.once("exit", (code, signal) => resolve(code ?? (signal ? 1 : 0)));
  });
  if (exitCode !== 0) process.exit(Number(exitCode));
}
