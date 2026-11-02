import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

const root = process.cwd()
const required = [
  "VERSION",
  "CHANGELOG.md",
  "AGENTS.md",
  "CLAUDE.md",
  ".env.example",
  ".wasproot",
  ".ai/project-profile.yaml",
  ".ai/installed-capabilities.json",
  "docs/PRD.md",
  "docs/local-sdlc.md",
  "docs/testing.md",
  "docs/versioning.md",
  "docs/getting-started-task-tracker.md",
  "docs/sdlc/README.md",
  "docs/sdlc/01-principles-and-authority.md",
  "docs/sdlc/02-lifecycle-and-gates.md",
  "docs/sdlc/03-requirements-and-feature-rds.md",
  "docs/sdlc/04-engineering-and-tdd.md",
  "docs/sdlc/05-validation-and-evidence.md",
  "docs/sdlc/06-release-deployment-and-rollback.md",
  "docs/sdlc/07-change-control-and-exceptions.md",
  "docs/features/000-overview.md",
  "docs/features/TEMPLATE-feature-rd.md",
  "main.wasp.ts",
  "schema.prisma",
  "tsconfig.src.json",
  "tsconfig.wasp.json",
  "vite.config.ts",
  "scripts/bootstrap.mjs",
  "scripts/apply-capability-pack.mjs",
  "scripts/database-check.mjs",
  "scripts/version-check.mjs",
  "scripts/version.mjs",
  "scripts/sdlc-check.mjs",
]

const missing = []
for (const file of required) {
  try {
    await readFile(path.join(root, file), "utf8")
  } catch {
    missing.push(file)
  }
}

const unresolved = []
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) await walk(fullPath)
    else {
      const text = await readFile(fullPath, "utf8").catch(() => "")
      if (/\{\{[A-Z0-9_]+\}\}/.test(text)) unresolved.push(path.relative(root, fullPath))
    }
  }
}

await walk(root)

const schema = await readFile(path.join(root, "schema.prisma"), "utf8")
if (!/datasource\s+db\s*{[^}]*provider\s*=\s*"postgresql"/s.test(schema)) {
  missing.push('schema.prisma PostgreSQL datasource')
}

if (missing.length || unresolved.length) {
  if (missing.length) console.error(`Missing required files: ${missing.join(", ")}`)
  if (unresolved.length) console.error(`Unresolved template tokens: ${unresolved.join(", ")}`)
  process.exit(1)
}

console.log("Template structure is valid.")

