import "./main.css"
import { logout, useAuth } from "wasp/client/auth"

export function MainPage() {
  const { data: user } = useAuth()
  return (
    <main id="main-content" className="shell">
      <nav className="app-nav" aria-label="Account">
        <span>{user?.displayName || user?.email}</span>
        <a href="/profile">Profile</a>
        <button type="button" className="button-link" onClick={() => void logout()}>Sign out</button>
      </nav>
      <p className="eyebrow">Wasp AI Development Template</p>
      <h1>Build from an approved contract.</h1>
      <p>
        Personalize <code>.ai/project-profile.yaml</code>, define your product
        requirements, and create the first Feature RD before implementation.
      </p>
      <ul>
        <li>Design explores.</li>
        <li>Architecture specifies.</li>
        <li>Implementation proves.</li>
        <li>Humans approve consequential actions.</li>
      </ul>
    </main>
  )
}

