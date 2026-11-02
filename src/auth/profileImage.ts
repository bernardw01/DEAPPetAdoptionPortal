export const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024
export const PROFILE_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const

export function isAllowedProfileImageType(value: string): boolean {
  return (PROFILE_IMAGE_TYPES as readonly string[]).includes(value.toLowerCase())
}

export function hasExpectedImageSignature(bytes: Uint8Array, mimeType: string): boolean {
  if (mimeType === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  if (mimeType === "image/png") {
    return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => bytes[index] === value)
  }
  if (mimeType === "image/webp") {
    return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF"
      && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  }
  return false
}
