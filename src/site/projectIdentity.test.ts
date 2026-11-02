import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("project identity", () => {
  it("AC-SITE-12: project name, package name, profile displayName and Wasp title identify Pet Rescue by Judy", () => {
    const profile = readFileSync(path.join(process.cwd(), ".ai/project-profile.yaml"), "utf8")
    const wasp = readFileSync(path.join(process.cwd(), "main.wasp.ts"), "utf8")
    const pkg = JSON.parse(readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as { name: string }
    expect(profile).toContain('displayName: "Pet Rescue by Judy Portal"')
    expect(profile).toContain('slug: "pet-rescue-by-judy"')
    expect(profile).toContain('packageName: "pet-rescue-by-judy"')
    expect(profile).toContain('copyrightHolder: "Pet Rescue by Judy"')
    expect(pkg.name).toBe("pet-rescue-by-judy")
    expect(wasp).toContain('name: "PetRescueByJudy"')
    expect(wasp).toContain('title: "Pet Rescue by Judy Portal"')
    expect(wasp).not.toContain("Wasp AI Starter")
  })
})
