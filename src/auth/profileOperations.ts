import { HttpError, prisma } from "wasp/server"
import {
  createProviderId,
  findAuthIdentity,
  getProviderDataWithPassword,
  updateAuthIdentityProviderData,
} from "wasp/server/auth"
import { verifyPassword } from "wasp/server/auth/password"
import type {
  ChangeOwnPassword,
  GetOwnProfile,
  UpdateOwnProfile,
  UploadOwnProfileImage,
} from "wasp/server/operations"
import { assertEmail } from "./identity"
import {
  hasExpectedImageSignature,
  isAllowedProfileImageType,
  PROFILE_IMAGE_MAX_BYTES,
} from "./profileImage"

function requireUserId(user: { id: string } | undefined): string {
  if (!user) throw new HttpError(401, "Authentication required")
  return user.id
}

function avatarDataUrl(image: { mimeType: string; content: Uint8Array } | null): string | null {
  if (!image) return null
  return `data:${image.mimeType};base64,${Buffer.from(image.content).toString("base64")}`
}

export const getOwnProfile: GetOwnProfile<void, {
  id: string
  email: string
  displayName: string | null
  avatarDataUrl: string | null
}> = async (_args, context) => {
  const userId = requireUserId(context.user)
  const user = await context.entities.User.findUniqueOrThrow({
    where: { id: userId },
    include: { profileImage: true },
  })
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatarDataUrl: avatarDataUrl(user.profileImage),
  }
}

export const updateOwnProfile: UpdateOwnProfile<
  { displayName?: string | null; email?: string },
  { email: string; displayName: string | null }
> = async (args, context) => {
  const userId = requireUserId(context.user)
  const current = await prisma.user.findUniqueOrThrow({ where: { id: userId } })
  let nextEmail = current.email
  if (args.email !== undefined) {
    try {
      nextEmail = assertEmail(args.email)
    } catch (error) {
      throw new HttpError(400, error instanceof Error ? error.message : "Invalid email")
    }
  }
  const displayName = args.displayName === undefined
    ? current.displayName
    : args.displayName?.trim() || null

  const duplicate = await prisma.user.findFirst({
    where: { email: nextEmail, NOT: { id: userId } },
    select: { id: true },
  })
  if (duplicate) throw new HttpError(400, "An account already uses that email address")

  const identity = await prisma.authIdentity.findFirst({
    where: { providerName: "username", auth: { userId } },
    select: { providerUserId: true },
  })
  if (!identity) throw new HttpError(400, "Password identity not found")

  const [updated] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { email: nextEmail, displayName },
      select: { email: true, displayName: true },
    }),
    prisma.authIdentity.update({
      where: {
        providerName_providerUserId: {
          providerName: "username",
          providerUserId: identity.providerUserId,
        },
      },
      data: { providerUserId: nextEmail },
    }),
  ])
  return updated
}

export const changeOwnPassword: ChangeOwnPassword<
  { currentPassword: string; newPassword: string },
  { ok: true }
> = async (args, context) => {
  const userId = requireUserId(context.user)
  if (args.newPassword.length < 8 || !/\d/.test(args.newPassword)) {
    throw new HttpError(400, "New password must be at least 8 characters and include a number")
  }
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })
  const providerId = createProviderId("username", user.email)
  const identity = await findAuthIdentity(providerId)
  if (!identity) throw new HttpError(400, "Password identity not found")
  const providerData = getProviderDataWithPassword<"username">(identity.providerData)
  try {
    await verifyPassword(providerData.hashedPassword, args.currentPassword)
  } catch {
    throw new HttpError(400, "Current password is incorrect")
  }
  await updateAuthIdentityProviderData<"username">(providerId, providerData, {
    hashedPassword: args.newPassword,
  })
  return { ok: true }
}

export const uploadOwnProfileImage: UploadOwnProfileImage<
  { fileName: string; mimeType: string; base64Data: string },
  { avatarDataUrl: string }
> = async (args, context) => {
  const userId = requireUserId(context.user)
  const mimeType = args.mimeType.trim().toLowerCase()
  if (!isAllowedProfileImageType(mimeType)) {
    throw new HttpError(400, "Profile pictures must be JPEG, PNG, or WebP")
  }
  const encoded = args.base64Data.includes(",") ? args.base64Data.split(",", 2)[1] : args.base64Data
  const content = Buffer.from(encoded || "", "base64")
  if (content.byteLength === 0 || content.byteLength > PROFILE_IMAGE_MAX_BYTES) {
    throw new HttpError(400, "Profile pictures must be between 1 byte and 5 MB")
  }
  if (!hasExpectedImageSignature(content, mimeType)) {
    throw new HttpError(400, "The file contents do not match the selected image type")
  }

  const image = await context.entities.ProfileImage.upsert({
    where: { userId },
    create: {
      userId,
      fileName: args.fileName.trim() || "profile-image",
      mimeType,
      byteSize: content.byteLength,
      content,
    },
    update: {
      fileName: args.fileName.trim() || "profile-image",
      mimeType,
      byteSize: content.byteLength,
      content,
    },
  })
  return { avatarDataUrl: avatarDataUrl(image)! }
}
