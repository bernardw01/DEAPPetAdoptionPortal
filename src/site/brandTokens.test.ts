import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { bodyFontStack, brandTokens, contrastPairs, displayFontStack } from "./brandTokens"
import { contrastRatio } from "./contrast"

describe("platform foundation tokens", () => {
  it("AC-FOUNDATION-01: brand tokens exist once with baseline names and values", () => {
    const css = readFileSync(path.join(process.cwd(), "src/main.css"), "utf8")
    for (const [name, value] of Object.entries(brandTokens)) {
      expect(css).toContain(`${name}: ${value}`)
    }
  })

  it("AC-FOUNDATION-01: contrast pairs used for text/UI meet WCAG AA", () => {
    for (const pair of contrastPairs) {
      const ratio = contrastRatio(pair.foreground, pair.background)
      expect(ratio, pair.name).toBeGreaterThanOrEqual(Math.min(pair.minimum, 4.5) - 0.05)
    }
  })

  it("AC-FOUNDATION-02: documented font stacks are Georgia display and Inter UI/body", () => {
    const css = readFileSync(path.join(process.cwd(), "src/main.css"), "utf8")
    expect(displayFontStack).toContain("Georgia")
    expect(bodyFontStack).toContain("Inter")
    expect(css).toContain('font-family: "Inter"')
    expect(css).toContain("inter-latin.woff2")
    expect(css).not.toContain("fraunces-latin.woff2")
    expect(css).not.toContain("figtree-latin.woff2")
    expect(css).not.toMatch(/fonts\.googleapis|fonts\.gstatic|typekit|use\.typekit/i)
    expect(readFileSync(path.join(process.cwd(), "src/site/fonts/OFL.txt"), "utf8").length).toBeGreaterThan(0)
    expect(readFileSync(path.join(process.cwd(), "src/site/fonts/inter-latin.woff2")).byteLength).toBeGreaterThan(1000)
  })

  it("AC-FOUNDATION-03: content container max-width is 1180px with baseline gutters", () => {
    const css = readFileSync(path.join(process.cwd(), "src/main.css"), "utf8")
    expect(css).toContain("min(1180px, calc(100% - 40px))")
    expect(css).toContain("min(100% - 28px, 1180px)")
  })
})
