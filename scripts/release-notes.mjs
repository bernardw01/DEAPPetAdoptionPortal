import { readFile } from "node:fs/promises"
import process from "node:process"

const version = process.argv[2] ?? (await readFile("VERSION", "utf8")).trim()
const changelog = await readFile("CHANGELOG.md", "utf8")
const heading = new RegExp(`^## \\[${version.replaceAll(".", "\\.")}\\](?: - [^\\n]+)?$`, "m")
const match = heading.exec(changelog)

if (!match) {
  console.error(`No CHANGELOG.md section found for ${version}.`)
  process.exit(1)
}

const contentStart = match.index + match[0].length
const nextHeading = changelog.slice(contentStart).search(/^## /m)
const contentEnd = nextHeading === -1 ? changelog.length : contentStart + nextHeading
const notes = changelog.slice(contentStart, contentEnd).trim()

if (!notes) {
  console.error(`CHANGELOG.md section for ${version} is empty.`)
  process.exit(1)
}

console.log(notes)
