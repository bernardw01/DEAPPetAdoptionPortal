import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { brandTokens, contrastPairs } from "./brandTokens"
import { contrastRatio } from "./contrast"

describe("brand tokens", () => {
  it("AC-SITE-09: CSS custom properties match the design-direction names and values", () => {
    const css = readFileSync(path.join(process.cwd(), "src/main.css"), "utf8")
    for (const [name, value] of Object.entries(brandTokens)) {
      expect(css).toContain(`${name}: ${value}`)
    }
  })

  it("AC-SITE-09: every listed foreground and background pair meets its minimum contrast ratio", () => {
    for (const pair of contrastPairs) {
      const ratio = contrastRatio(pair.foreground, pair.background)
      expect(ratio, pair.name).toBeGreaterThanOrEqual(pair.minimum - 0.02)
      expect(ratio, pair.name).toBeCloseTo(pair.minimum, 1)
    }
  })
})
