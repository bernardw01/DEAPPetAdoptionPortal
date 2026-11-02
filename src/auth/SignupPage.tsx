import { FormEvent, useState } from "react"
import { login, signup } from "wasp/client/auth"
import { assertEmail } from "./identity"
import "../main.css"

export function SignupPage() {
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setSubmitting(true)
    try {
      const normalizedEmail = assertEmail(email)
      await signup({
        username: normalizedEmail,
        email: normalizedEmail,
        displayName: displayName.trim() || null,
        password,
      })
      await login({ username: normalizedEmail, password })
      window.location.assign("/")
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create account")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-shell">
      <form className="card form-stack" onSubmit={onSubmit}>
        <p className="eyebrow">New account</p>
        <h1>Create your account</h1>
        <p>Your email address is also your username.</p>
        <label>
          Display name
          <input autoComplete="name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
        </label>
        <label>
          Email address
          <input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Password
          <input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
          <span className="field-hint">At least 8 characters with a number.</span>
        </label>
        <label>
          Confirm password
          <input type="password" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
        </label>
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <button type="submit" disabled={submitting}>{submitting ? "Creating…" : "Create account"}</button>
        <p>Already registered? <a href="/login">Sign in</a>.</p>
      </form>
    </main>
  )
}
