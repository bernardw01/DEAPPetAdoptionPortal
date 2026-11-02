import { cp, mkdtemp, readFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import process from "node:process"
import { promisify } from "node:util"
import { execFile } from "node:child_process"

const run = promisify(execFile)
const source = process.cwd()
const sourceManifest = JSON.parse(await readFile(path.join(source, "package.json"), "utf8"))

if (sourceManifest.name !== "wasp-ai-starter") {
  console.log("Bootstrap smoke is template-only; generated application detected, skipping.")
  process.exit(0)
}

const target = await mkdtemp(path.join(os.tmpdir(), "wasp-ai-template-"))

await cp(source, target, {
  recursive: true,
  filter: (entry) => {
    const relative = path.relative(source, entry)
    const first = relative.split(path.sep)[0]
    return ![".git", ".wasp", "node_modules"].includes(first)
  },
})

await run(
  process.execPath,
  [
    "scripts/bootstrap.mjs",
    "--project-name",
    "Acme Portal",
    "--slug",
    "acme-portal",
    "--owner",
    "Acme, Inc.",
    "--deployment",
    "railway",
    "--multi-tenant",
  ],
  { cwd: target },
)
await run(process.execPath, ["scripts/apply-capability-pack.mjs", "multitenancy"], {
  cwd: target,
})

const profile = await readFile(path.join(target, ".ai/project-profile.yaml"), "utf8")
const waspSpec = await readFile(path.join(target, "main.wasp.ts"), "utf8")
const packageManifest = JSON.parse(await readFile(path.join(target, "package.json"), "utf8"))
const envExample = await readFile(path.join(target, ".env.example"), "utf8")
const lockfile = JSON.parse(await readFile(path.join(target, "package-lock.json"), "utf8"))
const capabilities = JSON.parse(
  await readFile(path.join(target, ".ai/installed-capabilities.json"), "utf8"),
)
const tenantRule = await readFile(
  path.join(target, ".cursor/rules/18-tenant-isolation.mdc"),
  "utf8",
)

const failures = []
if (!profile.includes('displayName: "Acme Portal"')) failures.push("display name")
if (!profile.includes("multiTenant: true")) failures.push("multi-tenant profile")
if (!profile.includes('deploymentProvider: "railway"')) failures.push("deployment profile")
if (!profile.includes('usernamePolicy: "normalized-email"')) failures.push("email identity policy")
if (!waspSpec.includes('name: "AcmePortal"')) failures.push("Wasp app name")
if (!waspSpec.includes('userEntity: "User"')) failures.push("authentication")
if (!envExample.includes("/acme_portal")) failures.push("PostgreSQL database name")
if (packageManifest.name !== "acme-portal") failures.push("package name")
if (lockfile.name !== "acme-portal" || lockfile.packages[""].name !== "acme-portal") {
  failures.push("lockfile name")
}
if (!capabilities.capabilities.includes("multitenancy")) failures.push("capability registry")
if (!tenantRule.includes("# Tenant isolation")) failures.push("tenant rule")

if (failures.length) {
  console.error(`Bootstrap smoke failed: ${failures.join(", ")}`)
  process.exit(1)
}

console.log("Bootstrap and capability-pack smoke passed.")
