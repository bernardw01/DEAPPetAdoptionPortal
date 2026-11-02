import { FormEvent, useState } from "react"
import { login } from "wasp/client/auth"
import { normalizeEmail } from "./identity"
import "../main.css"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await login({ username: normalizeEmail(email), password })
      window.location.assign("/")
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not sign in")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-shell">
      <form className="card form-stack" onSubmit={onSubmit}>
        <p className="eyebrow">Account access</p>
        <h1>Sign in</h1>
        <label>
          Email address
          <input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Password
          <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <button type="submit" disabled={submitting}>{submitting ? "Signing in…" : "Sign in"}</button>
        <p>Need an account? <a href="/signup">Create one</a>.</p>
      </form>
    </main>
  )
}
