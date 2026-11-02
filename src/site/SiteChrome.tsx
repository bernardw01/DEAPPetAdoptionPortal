import { type ReactNode, useEffect, useId, useRef, useState } from "react"
import { org } from "./org"
import { primaryNav } from "./publicRoutes"

export type AccountState =
  | { kind: "sign-in" }
  | { kind: "account"; onSignOut: () => void }

type SiteChromeProps = {
  currentPath: string
  isClient: boolean
  isNarrow: boolean
  account: AccountState
  children: ReactNode
}

export function SiteChrome({ currentPath, isClient, isNarrow, account, children }: SiteChromeProps) {
  const navId = useId()
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const collapse = isClient && isNarrow

  useEffect(() => {
    if (!collapse) setMenuOpen(false)
  }, [collapse])

  useEffect(() => {
    if (!collapse || !menuOpen) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return
      event.preventDefault()
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [collapse, menuOpen])

  return (
    <div className="site">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="site-header">
        <div className="site-header-inner">
          <a className="wordmark" href="/">
            {org.wordmark}
          </a>
          {collapse ? (
            <button
              ref={menuButtonRef}
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-controls={navId}
              onClick={() => setMenuOpen((open) => !open)}
            >
              Menu
            </button>
          ) : null}
          <nav
            id={navId}
            className={collapse && !menuOpen ? "primary-nav is-collapsed" : "primary-nav"}
            aria-label="Primary"
          >
            {primaryNav.map((item) => {
              const current = currentPath === item.href
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={current ? "is-current" : undefined}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>
          <div className="header-actions">
            <a className="button donate" href="/ways-to-give">
              Donate
            </a>
            {account.kind === "sign-in" ? (
              <a className="account-control" href="/login">
                Sign in
              </a>
            ) : (
              <>
                <a className="account-control" href="/profile">
                  Account
                </a>
                <button type="button" className="button-link" onClick={account.onSignOut}>
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="site-main">
        {children}
      </main>
      <footer className="site-footer">
        <ContactBlock />
        <nav aria-label="Footer">
          <a href="/about">About Us</a>
          <a href="/contact">Contact Us</a>
          <a
            href={org.volunteerPortalUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Volunteer Portal (opens in a new tab)
          </a>
        </nav>
        <p className="copyright">{org.copyrightLine}</p>
      </footer>
    </div>
  )
}

function ContactBlock() {
  return (
    <address className="contact-details">
      <p>
        {org.addressLines[0]}
        <br />
        {org.addressLines[1]}
      </p>
      <p>
        <a href={org.phoneHref}>{org.phoneDisplay}</a>
      </p>
      <p>
        <a href={`mailto:${org.email}`}>{org.email}</a>
      </p>
    </address>
  )
}
