import { execFile } from "node:child_process"
import { createReadStream } from "node:fs"
import { readFile, stat } from "node:fs/promises"
import { createServer } from "node:http"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"

const run = promisify(execFile)
const root = process.cwd()
const distCandidates = [
  path.join(root, ".wasp/out/web-app/build"),
]

async function resolveDist() {
  for (const candidate of distCandidates) {
    try {
      await readFile(path.join(candidate, "index.html"))
      return candidate
    } catch {
      // try next
    }
  }
  throw new Error("Could not find prerendered index.html for Lighthouse.")
}

const dist = await resolveDist()
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".json": "application/json" }

const server = createServer(async (request, response) => {
  const urlPath = decodeURIComponent((request.url ?? "/").split("?")[0])
  const relative = urlPath === "/" ? "index.html" : urlPath.replace(/^\//, "")
  const filePath = path.join(dist, relative.endsWith("/") ? `${relative}index.html` : relative)
  try {
    const info = await stat(filePath)
    if (!info.isFile()) throw new Error("not a file")
    response.setHeader("content-type", types[path.extname(filePath)] ?? "application/octet-stream")
    createReadStream(filePath).pipe(response)
  } catch {
    try {
      response.setHeader("content-type", "text/html")
      createReadStream(path.join(dist, "index.html")).pipe(response)
    } catch (error) {
      response.statusCode = 500
      response.end(String(error))
    }
  }
})

await new Promise((resolve) => server.listen(4174, "127.0.0.1", resolve))

try {
  const lighthouseBin = fileURLToPath(new URL("../node_modules/lighthouse/cli/index.js", import.meta.url))
  const { stdout } = await run(
    process.execPath,
    [
      lighthouseBin,
      "http://127.0.0.1:4174/",
      "--only-categories=performance",
      "--form-factor=mobile",
      "--screenEmulation.mobile=true",
      "--screenEmulation.width=360",
      "--screenEmulation.height=640",
      "--screenEmulation.deviceScaleFactor=2",
      "--output=json",
      "--output-path=stdout",
      "--chrome-flags=--headless=new --no-sandbox",
      "--quiet",
    ],
    { cwd: root, maxBuffer: 20_000_000 },
  )
  const report = JSON.parse(stdout)
  const performance = Math.round((report.categories.performance.score ?? 0) * 100)
  const lcp = report.audits["largest-contentful-paint"]?.displayValue
  const cls = report.audits["cumulative-layout-shift"]?.displayValue
  console.log(`Lighthouse mobile-profile performance: ${performance}`)
  console.log(`LCP: ${lcp}`)
  console.log(`CLS: ${cls}`)
  if (performance < 90) {
    console.error(`AC-PERF-01 miss: performance ${performance} is below the 90 target (LCP ${lcp}, CLS ${cls}). Recorded, not hidden.`)
  } else {
    console.log("AC-PERF-01: performance meets the 90 target.")
  }
} finally {
  server.close()
}
