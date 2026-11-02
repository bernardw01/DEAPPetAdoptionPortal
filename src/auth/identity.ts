export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase()
}

export function isEmailAddress(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function assertEmail(raw: unknown): string {
  if (typeof raw !== "string") throw new Error("Email is required")
  const email = normalizeEmail(raw)
  if (!isEmailAddress(email)) throw new Error("Enter a valid email address")
  return email
}
