const baseUrl = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const failures = [];
const results = [];
const forbiddenStrings = [
  ["Ne", "vel"].join(""),
  ["Ne", "val"].join(""),
  ["254727", "416611"].join(""),
  ["victormureithi", "957"].join(""),
];

async function request(path, options) {
  const response = await fetch(`${baseUrl}${path}`, options);
  return { response, body: await response.text() };
}

async function check(name, fn) {
  try {
    const detail = await fn();
    results.push({ name, result: "PASS", detail });
  } catch (error) {
    failures.push(name);
    results.push({ name, result: "FAIL", detail: error instanceof Error ? error.message : String(error) });
  }
}

let homeHtml = "";
await check("GET / returns 200 and names the site", async () => {
  const { response, body } = await request("/");
  homeHtml = body;
  if (response.status !== 200) throw new Error(`expected 200, got ${response.status}`);
  if (!body.includes("Havenwood Suites")) throw new Error("response HTML does not mention the property");
  return `HTTP ${response.status}`;
});

for (const path of ["/robots.txt", "/sitemap.xml", "/admin/login"]) {
  await check(`GET ${path} returns 200`, async () => {
    const { response } = await request(path);
    if (response.status !== 200) throw new Error(`expected 200, got ${response.status}`);
    return `HTTP ${response.status}`;
  });
}

await check("GET /admin redirects to /admin/login while signed out", async () => {
  const { response } = await request("/admin", { redirect: "manual" });
  const location = response.headers.get("location");
  if (![301, 302, 303, 307, 308].includes(response.status)) throw new Error(`expected redirect, got HTTP ${response.status}`);
  if (!location || new URL(location, baseUrl).pathname !== "/admin/login") throw new Error(`unexpected redirect location: ${location ?? "missing"}`);
  return `HTTP ${response.status} → ${new URL(location, baseUrl).pathname}`;
});

await check("home HTML has no previous-client identifiers", async () => {
  if (!homeHtml) throw new Error("home response was unavailable");
  const found = forbiddenStrings.filter((value) => homeHtml.toLowerCase().includes(value.toLowerCase()));
  if (found.length) throw new Error(`found ${found.length} forbidden identifier(s)`);
  return "no matches";
});

const width = Math.max(...results.map((row) => row.name.length));
console.log(`\nSmoke checks against ${baseUrl}\n`);
for (const row of results) console.log(`${row.result.padEnd(5)}  ${row.name.padEnd(width)}  ${row.detail}`);
if (failures.length) process.exitCode = 1;
