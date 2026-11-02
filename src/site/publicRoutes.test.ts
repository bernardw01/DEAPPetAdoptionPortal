import { describe, expect, it } from "vitest"
import { primaryNav, publicRoutes } from "./publicRoutes"

describe("public route metadata", () => {
  it("AC-SITE-02: primary navigation lists the required labels and hrefs in order", () => {
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

  it("AC-SITE-03: each public route has a unique heading, title, and meta description", () => {
    const headings = publicRoutes.map((route) => route.heading)
    const titles = publicRoutes.map((route) => route.title)
    const descriptions = publicRoutes.map((route) => route.description)
    expect(new Set(headings).size).toBe(headings.length)
    expect(new Set(titles).size).toBe(titles.length)
    expect(new Set(descriptions).size).toBe(descriptions.length)
    for (const route of publicRoutes) {
      expect(route.title.length).toBeGreaterThan(0)
      expect(route.description.length).toBeGreaterThan(0)
      expect(route.heading.length).toBeGreaterThan(0)
    }
  })
})
