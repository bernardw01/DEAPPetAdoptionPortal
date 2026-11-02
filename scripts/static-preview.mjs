import { createReadStream } from "node:fs"
import { stat } from "node:fs/promises"
import { createServer } from "node:http"
import path from "node:path"
import process from "node:process"

const dist = path.join(process.cwd(), ".wasp/out/web-app/build")
const port = Number(process.env.PORT ?? 4173)
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".map": "application/json",
}

async function sendFile(response, filePath) {
  const info = await stat(filePath)
  if (!info.isFile()) throw new Error("not a file")
  response.setHeader("content-type", types[path.extname(filePath)] ?? "application/octet-stream")
  createReadStream(filePath).pipe(response)
}

const server = createServer(async (request, response) => {
  const urlPath = decodeURIComponent((request.url ?? "/").split("?")[0])
  if (urlPath.startsWith("/auth/") || urlPath === "/auth/me") {
    response.statusCode = 200
    response.setHeader("content-type", "application/json")
    response.end(JSON.stringify({ json: null }))
    return
  }
  const relative = urlPath === "/" ? "index.html" : urlPath.replace(/^\//, "")
  const candidates = [
    path.join(dist, relative),
    path.join(dist, relative, "index.html"),
    path.join(dist, `${relative}.html`),
    path.join(dist, "200.html"),
  ]
  for (const candidate of candidates) {
    try {
      await sendFile(response, candidate)
      return
    } catch {
      // try next
    }
  }
  response.statusCode = 404
  response.end("Not found")
})

server.listen(port, "127.0.0.1", () => {
  console.log(`Previewing ${dist} on http://127.0.0.1:${port}`)
})
