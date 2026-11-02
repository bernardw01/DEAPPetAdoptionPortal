import { execFile } from "node:child_process"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { promisify } from "node:util"

const run = promisify(execFile)
const root = process.cwd()
const htmlRoot = path.join(root, ".wasp/out/web-app/build")

const routes = [
  { path: "/", file: "index.html", heading: "Your new best friend is waiting.", title: "Pet Rescue by Judy | Home", description: "Meet loving dogs and cats ready for adoption at Pet Rescue by Judy in Sanford, Florida. Find your match, foster, volunteer, or give." },
  { path: "/animals", file: "animals/index.html", heading: "Animals", title: "Animals | Pet Rescue by Judy", description: "The animal catalog for Pet Rescue by Judy is coming soon. Contact the rescue for current animals." },
  { path: "/adopt-foster", file: "adopt-foster/index.html", heading: "Adopt / Foster", title: "Adopt or Foster | Pet Rescue by Judy", description: "Adoption and foster information for Pet Rescue by Judy is coming soon. Contact the rescue to get started." },
  { path: "/surrender", file: "surrender/index.html", heading: "Surrender", title: "Surrender | Pet Rescue by Judy", description: "The surrender section for Pet Rescue by Judy is coming soon. Contact the rescue for current guidance." },
  { path: "/volunteer", file: "volunteer/index.html", heading: "Volunteer", title: "Volunteer | Pet Rescue by Judy", description: "Volunteer information for Pet Rescue by Judy is coming soon. Use the Volunteer Portal if you are already approved." },
  { path: "/ways-to-give", file: "ways-to-give/index.html", heading: "Ways to Give", title: "Ways to Give | Pet Rescue by Judy", description: "Ways to give to Pet Rescue by Judy are coming soon. Contact the rescue to donate or help." },
  { path: "/successes", file: "successes/index.html", heading: "Successes", title: "Successes | Pet Rescue by Judy", description: "Success stories from Pet Rescue by Judy are coming soon." },
  { path: "/about", file: "about/index.html", heading: "About Us", title: "About Us | Pet Rescue by Judy", description: "Learn who Pet Rescue by Judy is. A fuller about page is coming soon." },
  { path: "/contact", file: "contact/index.html", heading: "Contact Us", title: "Contact Us | Pet Rescue by Judy", description: "Address, phone, and email for Pet Rescue by Judy in Sanford, Florida." },
  { path: "/login", file: "login/index.html", heading: "Sign in", title: "Sign in | Pet Rescue by Judy", description: "Sign in to your Pet Rescue by Judy account." },
  { path: "/signup", file: "signup/index.html", heading: "Create your account", title: "Create your account | Pet Rescue by Judy", description: "Create a Pet Rescue by Judy account using your email address." },
]

const navHrefs = ["/", "/animals", "/adopt-foster", "/surrender", "/volunteer", "/ways-to-give", "/successes"]

async function walk(directory, files = []) {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => [])
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) await walk(fullPath, files)
    else files.push(fullPath)
  }
  return files
}

const waspBuild = await run("wasp", ["build"], { cwd: root, env: process.env, maxBuffer: 20_000_000 })
process.stdout.write(waspBuild.stdout)
process.stderr.write(waspBuild.stderr)

const binPath = `${path.join(root, "node_modules/.bin")}${path.delimiter}${process.env.PATH ?? ""}`
const viteBuild = await run("vite", ["build"], {
  cwd: root,
  env: {
    ...process.env,
    PATH: binPath,
    REACT_APP_API_URL: process.env.REACT_APP_API_URL ?? "http://127.0.0.1:4173",
  },
  maxBuffer: 20_000_000,
})
process.stdout.write(viteBuild.stdout)
process.stderr.write(viteBuild.stderr)

const htmlFiles = (await walk(htmlRoot)).filter((file) => file.endsWith(".html"))
if (htmlFiles.length < routes.length) {
  console.error("Could not locate prerendered HTML. Files:")
  for (const file of htmlFiles) console.error(file)
  process.exit(1)
}

console.log(`Prerender output path: ${htmlRoot}`)
console.log("HTML files:")
for (const file of htmlFiles.sort()) console.log(`- ${path.relative(htmlRoot, file)}`)

const failures = []
for (const route of routes) {
  const filePath = path.join(htmlRoot, route.file)
  let html = ""
  try {
    html = await readFile(filePath, "utf8")
  } catch {
    failures.push(`${route.path}: missing HTML file ${route.file}`)
    continue
  }
  if (!html.includes(route.heading)) failures.push(`${route.path}: missing h1 text`)
  if (!html.includes(`<title>${route.title}</title>`)) failures.push(`${route.path}: missing title`)
  if (!html.includes(`<meta name="description" content="${route.description}"/>`) && !html.includes(`<meta name="description" content="${route.description}" />`)) {
    failures.push(`${route.path}: missing meta description`)
  }
  if (!html.includes("Sign in")) failures.push(`${route.path}: missing Sign in account control`)
  if (!html.includes("Skip to main content")) failures.push(`${route.path}: missing skip link`)
  if (!html.includes("401 South Laurel Avenue")) failures.push(`${route.path}: missing footer address`)
  for (const href of navHrefs) {
    if (!html.includes(`href="${href}"`)) failures.push(`${route.path}: missing nav href ${href}`)
  }
}

const profileHtml = htmlFiles.some((file) => file.includes(`${path.sep}profile${path.sep}`) || file.endsWith(`${path.sep}profile.html`))
if (profileHtml) failures.push("authRequired /profile was prerendered")

if (failures.length) {
  console.error("Prerender check failed:")
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`AC-PRERENDER-01/02/04: ${routes.length} prerendered HTML files contain nav, h1, title, description, and footer; /profile was not prerendered.`)
