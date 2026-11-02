import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { prerenderedPublicPaths } from "./publicRoutes"

describe("prerender declarations", () => {
  const wasp = readFileSync(path.join(process.cwd(), "main.wasp.ts"), "utf8")

  it("AC-PRERENDER-01: every public route including login and signup is declared with prerendering", () => {
    for (const routePath of prerenderedPublicPaths) {
      expect(wasp).toContain(`"${routePath}"`)
    }
    const prerenderCount = wasp.split("prerender: true").length - 1
    expect(prerenderCount).toBe(prerenderedPublicPaths.length)
  })

  it("AC-PRERENDER-04: authRequired profile route is never marked for prerendering", () => {
    expect(wasp).toMatch(/route\("ProfileRoute", "\/profile", page\(ProfilePage, \{ authRequired: true \}\)\)/)
    expect(wasp).not.toMatch(/ProfileRoute[\s\S]{0,80}prerender/)
  })
})
