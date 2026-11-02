import { readFile } from "node:fs/promises"
import process from "node:process"

const readJson = async (file) => JSON.parse(await readFile(file, "utf8"))
const canonical = (await readFile("VERSION", "utf8")).trim()
const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/

if (!semver.test(canonical)) {
  console.error(`VERSION must contain a stable semantic version; received ${canonical}.`)
  process.exit(1)
}

const packageJson = await readJson("package.json")
const packageLock = await readJson("package-lock.json")
const methodology = await readJson(".ai/methodology-version.json")
const changelog = await readFile("CHANGELOG.md", "utf8")
const versions = {
  "package.json": packageJson.version,
  "package-lock.json": packageLock.version,
  "package-lock.json root package": packageLock.packages?.[""]?.version,
  "methodology version": methodology.version,
  "template version": methodology.templateVersion,
}

const mismatches = Object.entries(versions).filter(([, value]) => value !== canonical)
if (mismatches.length) {
  for (const [source, value] of mismatches) {
    console.error(`${source} is ${value ?? "missing"}; expected ${canonical}.`)
  }
  process.exit(1)
}

if (!changelog.includes(`## [${canonical}]`)) {
  console.error(`CHANGELOG.md has no release heading for ${canonical}.`)
  process.exit(1)
}

console.log(`Template version ${canonical} is consistent.`)
