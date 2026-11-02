import { readFile, writeFile } from "node:fs/promises"
import process from "node:process"

const argument = process.argv[2]
const dryRun = process.argv.includes("--dry-run")
const current = (await readFile("VERSION", "utf8")).trim()
const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/

if (!argument || (!semver.test(argument) && !["patch", "minor", "major"].includes(argument))) {
  console.error("Usage: npm run version:bump -- <patch|minor|major|X.Y.Z> [--dry-run]")
  process.exit(1)
}

if (!semver.test(current)) {
  console.error(`Current VERSION is not valid semantic versioning: ${current}`)
  process.exit(1)
}

const parts = current.split(".").map(Number)
let next = argument
if (argument === "patch") next = `${parts[0]}.${parts[1]}.${parts[2] + 1}`
if (argument === "minor") next = `${parts[0]}.${parts[1] + 1}.0`
if (argument === "major") next = `${parts[0] + 1}.0.0`

const numeric = (version) => version.split(".").map(Number)
const [currentMajor, currentMinor, currentPatch] = numeric(current)
const [nextMajor, nextMinor, nextPatch] = numeric(next)
const isNewer = nextMajor > currentMajor
  || (nextMajor === currentMajor && nextMinor > currentMinor)
  || (nextMajor === currentMajor && nextMinor === currentMinor && nextPatch > currentPatch)

if (!isNewer) {
  console.error(`Next version ${next} must be greater than current version ${current}.`)
  process.exit(1)
}

console.log(`${current} -> ${next}${dryRun ? " (dry run)" : ""}`)
if (dryRun) process.exit(0)

const readJson = async (file) => JSON.parse(await readFile(file, "utf8"))
const writeJson = async (file, value) => writeFile(file, `${JSON.stringify(value, null, 2)}\n`)
const packageJson = await readJson("package.json")
const packageLock = await readJson("package-lock.json")
const methodology = await readJson(".ai/methodology-version.json")

packageJson.version = next
packageLock.version = next
packageLock.packages[""].version = next
methodology.version = next
methodology.templateVersion = next

await Promise.all([
  writeFile("VERSION", `${next}\n`),
  writeJson("package.json", packageJson),
  writeJson("package-lock.json", packageLock),
  writeJson(".ai/methodology-version.json", methodology),
])

console.log(`Updated version-bearing files. Add the ${next} section to CHANGELOG.md.`)
