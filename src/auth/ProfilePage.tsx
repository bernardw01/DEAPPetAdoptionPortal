import { FormEvent, useEffect, useRef, useState } from "react"
import { useQuery } from "wasp/client/operations"
import {
  changeOwnPassword,
  getOwnProfile,
  updateOwnProfile,
  uploadOwnProfileImage,
} from "wasp/client/operations"
import { PROFILE_IMAGE_MAX_BYTES, PROFILE_IMAGE_TYPES } from "./profileImage"
import "../main.css"

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ""))
    reader.onerror = () => reject(new Error("Could not read the image"))
    reader.readAsDataURL(file)
  })
}

export function ProfilePage() {
  const { data: profile, refetch, isLoading } = useQuery(getOwnProfile)
  const fileInput = useRef<HTMLInputElement>(null)
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    if (!profile) return
    setDisplayName(profile.displayName ?? "")
    setEmail(profile.email)
  }, [profile?.id])

  if (isLoading || !profile) return <div className="page-block"><p>Loading profile…</p></div>

  async function saveProfile(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setMessage(null)
    try {
      const updated = await updateOwnProfile({ displayName, email })
      setDisplayName(updated.displayName ?? "")
      setEmail(updated.email)
      setMessage("Profile saved. Use the updated email the next time you sign in.")
      await refetch()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save profile")
    }
  }

  async function changePassword(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setMessage(null)
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }
    try {
      await changeOwnPassword({ currentPassword, newPassword })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setMessage("Password updated.")
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not update password")
    }
  }

  async function changePhoto(file: File | null) {
    if (!file) return
    setError(null)
    setMessage(null)
    if (file.size > PROFILE_IMAGE_MAX_BYTES) {
      setError("Profile pictures must be 5 MB or smaller")
      return
    }
    try {
      await uploadOwnProfileImage({
        fileName: file.name,
        mimeType: file.type,
        base64Data: await fileToDataUrl(file),
      })
      setMessage("Profile picture updated.")
      await refetch()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not update picture")
    } finally {
      if (fileInput.current) fileInput.current.value = ""
    }
  }

  const initials = (displayName || email).split(/\s+|@/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("")

  return (
    <div className="profile-grid">
      <header className="page-header">
        <div><p className="eyebrow">Account</p><h1>Your profile</h1></div>
        <a href="/">Back to home</a>
      </header>
      {message ? <p className="form-success" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}

      <section className="card profile-photo" aria-labelledby="photo-title">
        <div className="avatar" aria-hidden="true">
          {profile.avatarDataUrl ? <img src={profile.avatarDataUrl} alt="" /> : <span>{initials}</span>}
        </div>
        <div>
          <h2 id="photo-title">Profile picture</h2>
          <p>JPEG, PNG, or WebP. Maximum 5 MB.</p>
          <input
            ref={fileInput}
            className="visually-hidden"
            type="file"
            accept={PROFILE_IMAGE_TYPES.join(",")}
            onChange={(event) => void changePhoto(event.target.files?.[0] ?? null)}
          />
          <button type="button" onClick={() => fileInput.current?.click()}>Change picture</button>
        </div>
      </section>

      <form className="card form-stack" onSubmit={saveProfile}>
        <h2>Profile details</h2>
        <label>Display name<input autoComplete="name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label>
        <label>Email address<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <p className="field-hint">Your email address and username always remain the same.</p>
        <button type="submit">Save profile</button>
      </form>

      <form className="card form-stack" onSubmit={changePassword}>
        <h2>Change password</h2>
        <label>Current password<input type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label>
        <label>New password<input type="password" autoComplete="new-password" minLength={8} required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></label>
        <label>Confirm new password<input type="password" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label>
        <button type="submit">Change password</button>
      </form>
    </div>
  )
}
