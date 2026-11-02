import { describe, expect, it } from "vitest"
import { deliveryStages, isExternalAction } from "./projectProfile"

describe("delivery language", () => {
  it("AC-FOUNDATION-01: preserves the ordered delivery stages", () => {
    expect(deliveryStages).toEqual(["Build", "Validate", "Ship", "Deploy"])
  })

  it("AC-FOUNDATION-02: treats publishing and production release as external actions", () => {
    expect(isExternalAction("Build")).toBe(false)
    expect(isExternalAction("Validate")).toBe(false)
    expect(isExternalAction("Ship")).toBe(true)
    expect(isExternalAction("Deploy")).toBe(true)
  })
})
