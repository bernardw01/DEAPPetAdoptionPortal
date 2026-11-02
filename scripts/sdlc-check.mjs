import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

const root = process.cwd()
const errors = []
const read = (file) => readFile(path.join(root, file), "utf8")

const requiredHandbook = [
  "docs/sdlc/README.md",
  "docs/sdlc/01-principles-and-authority.md",
  "docs/sdlc/02-lifecycle-and-gates.md",
  "docs/sdlc/03-requirements-and-feature-rds.md",
  "docs/sdlc/04-engineering-and-tdd.md",
  "docs/sdlc/05-validation-and-evidence.md",
  "docs/sdlc/06-release-deployment-and-rollback.md",
  "docs/sdlc/07-change-control-and-exceptions.md",
]

for (const file of requiredHandbook) {
  await read(file).catch(() => errors.push(`Missing required SDLC document: ${file}`))
}

const readme = await read("README.md").catch(() => "")
if (!readme.includes("docs/sdlc/README.md")) {
  errors.push("README.md must link to docs/sdlc/README.md")
}

const prd = await read("docs/PRD.md").catch(() => "")
const requiredPrdHeadings = [
  "# Engineering Product Requirements Document",
  "## Document control",
  "## Product purpose",
  "## Users, problems, and evidence",
  "## Goals and non-goals",
  "## Scope",
  "## Domain and system context",
  "## Functional requirements",
  "## Non-functional requirements",
  "## Authentication, authorization, privacy, and security",
  "## Data lifecycle and recovery",
  "## Accessibility and user experience",
  "## Reliability, performance, and observability",
  "## Integrations and deployment context",
  "## Assumptions, dependencies, and risks",
  "## Decisions required",
  "## Requirement traceability",
]
for (const heading of requiredPrdHeadings) {
  if (!prd.includes(heading)) errors.push(`docs/PRD.md is missing ${heading}`)
}
if (!/\*\*Status:\*\*\s+(Draft|Proposed|Approved)/.test(prd)) {
  errors.push("docs/PRD.md must declare Draft, Proposed, or Approved status")
}

const overview = await read("docs/features/000-overview.md").catch(() => "")
const featureFiles = (await readdir(path.join(root, "docs/features")))
  .filter((name) => /^\d{3}-.+\.md$/.test(name) && !name.startsWith("000-"))

const requiredHeadings = [
  "# Feature RD ",
  "## Status",
  "## Requirement traceability",
  "## Acceptance criteria",
  "## Verification",
]

for (const file of featureFiles) {
  const text = await read(`docs/features/${file}`)
  const id = file.slice(0, 3)
  for (const heading of requiredHeadings) {
    if (!text.includes(heading)) errors.push(`${file} is missing ${heading.trim()}`)
  }
  if (!overview.includes(`| ${Number(id).toString().padStart(3, "0")} |`)) {
    errors.push(`${file} is not indexed in docs/features/000-overview.md`)
  }
  const status = text.match(/## Status\s+([^\n]+)/)?.[1]?.trim()
  if (["Proposed", "Planned"].includes(status) && /^- \[x\] AC-/m.test(text)) {
    errors.push(`${file} checks acceptance criteria while status is ${status}`)
  }
}

const plan = await read("docs/implementation-plan.md").catch(() => "")
if (!/^## Phase /m.test(plan)) errors.push("docs/implementation-plan.md must contain a Phase")

if (errors.length) {
  console.error("SDLC governance check failed:\n")
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`SDLC governance is valid (Engineering PRD and ${featureFiles.length} Feature RDs checked).`)
