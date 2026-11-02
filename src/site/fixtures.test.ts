import { describe, expect, it } from "vitest"
import { discoveryCard, featuredAnimals, heroAnimal } from "./fixtures"
import { primaryNav } from "./publicRoutes"

describe("homepage fixtures and nav", () => {
  it("AC-HOME-03: primary sitewide navigation retains FR-024 destinations in order", () => {
    expect(primaryNav.map((item) => [item.label, item.href])).toEqual([
      ["Home", "/"],
      ["Animals", "/animals"],
      ["Adopt / Foster", "/adopt-foster"],
      ["Surrender", "/surrender"],
      ["Volunteer", "/volunteer"],
      ["Ways to Give", "/ways-to-give"],
      ["Successes", "/successes"],
    ])
  })

  it("AC-HOME-05: featured animals use fixture identities with correct alt text", () => {
    expect(featuredAnimals.map((animal) => animal.name)).toEqual(["Silas", "Suki"])
    expect(featuredAnimals[0].alt).toContain("Silas")
    expect(featuredAnimals[1].alt).toContain("Suki")
    expect(heroAnimal.alt).toContain("Suki")
    expect(discoveryCard.alt.length).toBeGreaterThan(0)
  })
})
