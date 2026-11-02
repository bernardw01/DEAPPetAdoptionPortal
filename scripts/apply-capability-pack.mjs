import { access, copyFile, mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

const root = process.cwd()
const packName = process.argv[2]
if (!packName || !/^[a-z0-9-]+$/.test(packName)) {
  console.error("Usage: npm run capability:add -- <pack-name>")
  process.exit(1)
}

const packRoot = path.join(root, ".ai", "capability-packs", packName)
let manifest
try {
  manifest = JSON.parse(await readFile(path.join(packRoot, "manifest.json"), "utf8"))
} catch {
  console.error(`Unknown capability pack: ${packName}`)
  process.exit(1)
}

for (const file of manifest.files) {
  const source = path.join(packRoot, file.source)
  const target = path.join(root, file.target)
  await mkdir(path.dirname(target), { recursive: true })
  try {
    await access(target)
    console.error(`Refusing to overwrite existing file: ${file.target}`)
    process.exit(1)
  } catch {
    await copyFile(source, target)
  }
}

const installedPath = path.join(root, ".ai", "installed-capabilities.json")
let installed = { schemaVersion: 1, capabilities: [] }
try {
  installed = JSON.parse(await readFile(installedPath, "utf8"))
} catch {}
if (!installed.capabilities.includes(packName)) installed.capabilities.push(packName)
installed.capabilities.sort()
await writeFile(installedPath, `${JSON.stringify(installed, null, 2)}\n`)
console.log(`Installed capability pack: ${packName}`)
