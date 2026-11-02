import { HttpError } from "wasp/server"
import { defineUserSignupFields } from "wasp/server/auth"
import type { OnBeforeSignupHook } from "wasp/server/auth"
import { assertEmail } from "./identity"

export const userSignupFields = defineUserSignupFields({
  email: (data) => assertEmail(data.email),
  displayName: (data) => {
    if (typeof data.displayName !== "string") return null
    return data.displayName.trim() || null
  },
})

export const onBeforeSignup: OnBeforeSignupHook = async ({ providerId, req }) => {
  if (providerId.providerName !== "username") {
    throw new HttpError(400, "Email and password sign-up is required")
  }

  let email: string
  try {
    email = assertEmail((req.body as { email?: unknown } | undefined)?.email)
  } catch (error) {
    throw new HttpError(400, error instanceof Error ? error.message : "Invalid email")
  }

  if (providerId.providerUserId !== email) {
    throw new HttpError(400, "The sign-in identifier must match the email address")
  }

  const password = (req.body as { password?: unknown } | undefined)?.password
  if (typeof password !== "string" || password.length < 8 || !/\d/.test(password)) {
    throw new HttpError(400, "Password must be at least 8 characters and include a number")
  }
}
