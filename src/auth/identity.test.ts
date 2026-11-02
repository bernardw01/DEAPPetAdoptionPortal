import { describe, expect, it } from "vitest"
import { assertEmail, normalizeEmail } from "./identity"

describe("email identity", () => {
  it("AC-IDENTITY-02: normalizes the email used as username", () => {
    expect(normalizeEmail("  Person@Example.COM ")).toBe("person@example.com")
  })

  it("AC-IDENTITY-02: rejects non-email usernames", () => {
    expect(() => assertEmail("ordinary-username")).toThrow("valid email")
  })
})
