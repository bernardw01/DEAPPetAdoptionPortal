import { type ReactNode, useEffect, useId, useRef, useState } from "react"
import { announcement, brandLogo } from "./fixtures"
import { org } from "./org"
import { primaryNav } from "./publicRoutes"
import { Wrap } from "./primitives"

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

      <div className="announcement" role="status">
        <Wrap className="announcement__inner">
          <span>
            <strong>{announcement.text.split(":")[0]}:</strong>
            {announcement.text.includes(":") ? announcement.text.slice(announcement.text.indexOf(":") + 1) : ""}
          </span>
          <a href={announcement.href}>
            {announcement.linkLabel} <span aria-hidden="true">→</span>
          </a>
        </Wrap>
      </div>

      <header className="site-header">
        <Wrap className="header__inner">
          <a className="brand" href="/" aria-label="Pet Rescue by Judy home">
            <img src={brandLogo.src} alt={brandLogo.alt} width={78} height={66} />
          </a>

          {collapse ? (
            <button
              ref={menuButtonRef}
              type="button"
              className="menu-button"
              aria-label="Menu"
              aria-expanded={menuOpen}
              aria-controls={navId}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="menu-button__label" aria-hidden="true">
                Menu
              </span>
              <span aria-hidden="true">☰</span>
            </button>
          ) : null}

          <nav
            id={navId}
            className="primary-nav"
            aria-label="Primary"
            data-open={collapse ? (menuOpen ? "true" : "false") : undefined}
            hidden={collapse && !menuOpen ? true : undefined}
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
            {account.kind === "sign-in" ? (
              <a className="text-action account-control" href="/login">
                Sign in
              </a>
            ) : (
              <>
                <a className="text-action account-control" href="/profile">
                  Account
                </a>
                <button type="button" className="text-action button-link" onClick={account.onSignOut}>
                  Sign out
                </button>
              </>
            )}
            <a className="button button--small donate" href="/ways-to-give">
              Donate
            </a>
          </div>
        </Wrap>
      </header>

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>

      <footer id="footer" className="site-footer">
        <Wrap className="footer-grid">
          <div className="footer-brand">
            <img src={brandLogo.src} alt={brandLogo.alt} width={115} height={100} />
            <p>A nonprofit, no-kill rescue giving dogs and cats throughout Central Florida a second chance.</p>
          </div>
          <div>
            <h2>Visit us</h2>
            <p>
              {org.addressLines[0]}
              <br />
              {org.addressLines[1]}
            </p>
            <p>
              <a href={org.phoneHref}>{org.phoneDisplay}</a>
              <br />
              <a href={`mailto:${org.email}`}>{org.email}</a>
            </p>
          </div>
          <div>
            <h2>Explore</h2>
            <ul>
              <li>
                <a href="/animals">Available pets</a>
              </li>
              <li>
                <a href="/adopt-foster">Adoption process</a>
              </li>
              <li>
                <a href="/volunteer">Volunteer</a>
              </li>
              <li>
                <a href="/ways-to-give">Ways to give</a>
              </li>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact Us</a>
              </li>
            </ul>
          </div>
          <div>
            <h2>Connect</h2>
            <ul>
              <li>
                <a href={org.volunteerPortalUrl} rel="noopener noreferrer" target="_blank">
                  Volunteer Portal (opens in a new tab)
                </a>
              </li>
              <li>
                <a href="/contact">Contact us</a>
              </li>
            </ul>
          </div>
        </Wrap>
        <Wrap className="footer-bottom">
          <p>{org.copyrightLine}</p>
        </Wrap>
      </footer>
    </div>
  )
}
