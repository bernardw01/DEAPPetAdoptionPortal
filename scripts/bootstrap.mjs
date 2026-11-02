import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

const root = process.cwd()
const args = process.argv.slice(2)
const option = (name) => {
  const index = args.indexOf(`--${name}`)
  return index >= 0 ? args[index + 1] : undefined
}
const has = (name) => args.includes(`--${name}`)
const fail = (message) => {
  console.error(message)
  process.exit(1)
}

const projectName = option("project-name")
const slug = option("slug")
const owner = option("owner") ?? "Project contributors"
const deployment = option("deployment") ?? "unconfigured"
const multiTenant = has("multi-tenant")

if (!projectName || !slug) {
  fail('Usage: npm run bootstrap -- --project-name "Acme Portal" --slug acme-portal [--owner "Acme, Inc."] [--deployment railway] [--multi-tenant]')
}
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  fail("Slug must contain lowercase letters, numbers, and single hyphens only.")
}

const waspName = slug.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("")

async function update(relativePath, transform) {
  const filePath = path.join(root, relativePath)
  const before = await readFile(filePath, "utf8")
  const after = transform(before)
  if (before === after) fail(`Bootstrap could not update ${relativePath}; starter values were not found.`)
  await writeFile(filePath, after)
}

await update(".ai/project-profile.yaml", (text) =>
  text
    .replace('displayName: "Wasp AI Starter"', `displayName: ${JSON.stringify(projectName)}`)
    .replace('slug: "wasp-ai-starter"', `slug: ${JSON.stringify(slug)}`)
    .replace('packageName: "wasp-ai-starter"', `packageName: ${JSON.stringify(slug)}`)
    .replace('copyrightHolder: "Project contributors"', `copyrightHolder: ${JSON.stringify(owner)}`)
    .replace("multiTenant: false", `multiTenant: ${multiTenant}`)
    .replace('deploymentProvider: "unconfigured"', `deploymentProvider: ${JSON.stringify(deployment)}`),
)

await update("package.json", (text) => {
  const manifest = JSON.parse(text)
  manifest.name = slug
  return `${JSON.stringify(manifest, null, 2)}\n`
})

await update("package-lock.json", (text) => {
  const lockfile = JSON.parse(text)
  lockfile.name = slug
  if (lockfile.packages?.[""]) lockfile.packages[""].name = slug
  return `${JSON.stringify(lockfile, null, 2)}\n`
})

await update("main.wasp.ts", (text) =>
  text
    .replace('name: "WaspAiStarter"', `name: ${JSON.stringify(waspName)}`)
    .replace('title: "Wasp AI Starter"', `title: ${JSON.stringify(projectName)}`),
)

await update(".env.example", (text) =>
  text.replace("/wasp_ai_starter", `/${slug.replaceAll("-", "_")}`),
)

console.log(`Personalized ${projectName} (${slug}).`)
console.log("Review the diff, replace the starter PRD, then run npm install and npm run sdlc:validate.")
