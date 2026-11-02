import { describe, expect, it } from "vitest"
import { hasExpectedImageSignature, isAllowedProfileImageType } from "./profileImage"

describe("profile image validation", () => {
  it("AC-PROFILE-04: allows only the declared web image formats", () => {
    expect(isAllowedProfileImageType("image/jpeg")).toBe(true)
    expect(isAllowedProfileImageType("image/svg+xml")).toBe(false)
  })

  it("AC-PROFILE-04: checks file signatures instead of trusting MIME metadata", () => {
    expect(hasExpectedImageSignature(Uint8Array.from([0xff, 0xd8, 0xff]), "image/jpeg")).toBe(true)
    expect(hasExpectedImageSignature(Uint8Array.from([0x3c, 0x73, 0x76, 0x67]), "image/jpeg")).toBe(false)
  })
})
