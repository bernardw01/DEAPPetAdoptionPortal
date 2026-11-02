/** @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { SiteChrome } from "./SiteChrome"
import { org } from "./org"
import { primaryNav } from "./publicRoutes"

afterEach(() => {
  cleanup()
})

function renderChrome(overrides: Partial<Parameters<typeof SiteChrome>[0]> = {}) {
  return render(
    <SiteChrome
      currentPath="/"
      isClient={false}
      isNarrow={false}
      account={{ kind: "sign-in" }}
      {...overrides}
    >
      <h1>Page heading</h1>
    </SiteChrome>,
  )
}

describe("site chrome", () => {
  it("AC-SITE-02: renders the wordmark and primary navigation landmark in order", () => {
    renderChrome()
    expect(screen.getByRole("link", { name: org.wordmark })).toHaveAttribute("href", "/")
    const nav = screen.getByRole("navigation", { name: "Primary" })
    const links = [...nav.querySelectorAll("a")].map((link) => [link.textContent, link.getAttribute("href")])
    expect(links).toEqual(primaryNav.map((item) => [item.label, item.href]))
  })

  it("AC-SITE-04: only the current route link has aria-current and a non-color class", () => {
    renderChrome({ currentPath: "/volunteer" })
    const nav = screen.getByRole("navigation", { name: "Primary" })
    const links = [...nav.querySelectorAll("a")]
    const current = links.filter((link) => link.getAttribute("aria-current") === "page")
    expect(current).toHaveLength(1)
    expect(current[0]).toHaveTextContent("Volunteer")
    expect(current[0].classList.contains("is-current")).toBe(true)
    expect(links.filter((link) => link.classList.contains("is-current"))).toHaveLength(1)
  })

  it("AC-SITE-05: after hydration below 48rem the nav is behind a Menu button that toggles and restores focus on Escape", async () => {
    const user = userEvent.setup()
    renderChrome({ isClient: true, isNarrow: true })
    const button = screen.getByRole("button", { name: "Menu" })
    const nav = screen.getByRole("navigation", { name: "Primary" })
    expect(button).toHaveAttribute("aria-expanded", "false")
    expect(button).toHaveAttribute("aria-controls", nav.id)
    expect(nav.classList.contains("is-collapsed")).toBe(true)

    button.focus()
    await user.keyboard("{Enter}")
    expect(button).toHaveAttribute("aria-expanded", "true")
    await user.keyboard(" ")
    expect(button).toHaveAttribute("aria-expanded", "false")
    await user.keyboard("{Enter}")
    expect(nav.classList.contains("is-collapsed")).toBe(false)

    await user.keyboard("{Escape}")
    expect(button).toHaveAttribute("aria-expanded", "false")
    expect(button).toHaveFocus()
  })

  it("AC-SITE-05: at 48rem and above all links are visible with no Menu button", () => {
    renderChrome({ isClient: true, isNarrow: false })
    expect(screen.queryByRole("button", { name: "Menu" })).toBeNull()
    expect(screen.getByRole("navigation", { name: "Primary" }).classList.contains("is-collapsed")).toBe(false)
  })

  it("AC-SITE-06: skip link is the first focusable control and targets the single main landmark", async () => {
    const user = userEvent.setup()
    renderChrome()
    await user.tab()
    const skip = screen.getByRole("link", { name: "Skip to main content" })
    expect(skip).toHaveFocus()
    expect(skip).toHaveAttribute("href", "#main-content")
    const mains = screen.getAllByRole("main")
    expect(mains).toHaveLength(1)
    expect(mains[0]).toHaveAttribute("id", "main-content")
  })

  it("AC-SITE-07: footer shows contact details, About, Contact, and an external Volunteer Portal link", () => {
    renderChrome()
    expect(screen.getByText(/401 South Laurel Avenue/)).toBeTruthy()
    expect(screen.getByText(/Sanford, FL 32771/)).toBeTruthy()
    expect(screen.getByRole("link", { name: org.phoneDisplay })).toHaveAttribute("href", org.phoneHref)
    expect(screen.getByRole("link", { name: org.email })).toHaveAttribute("href", `mailto:${org.email}`)
    expect(screen.getByRole("link", { name: "About Us" })).toHaveAttribute("href", "/about")
    expect(screen.getByRole("link", { name: "Contact Us" })).toHaveAttribute("href", "/contact")
    const volunteer = screen.getByRole("link", { name: /Volunteer Portal \(opens in a new tab\)/ })
    expect(volunteer).toHaveAttribute("rel", "noopener noreferrer")
    expect(volunteer).toHaveAttribute("href", org.volunteerPortalUrl)
  })

  it("AC-SITE-08: prerender and first paint show Sign in; authenticated client shows Account and Sign out", async () => {
    const onSignOut = vi.fn()
    const { rerender } = renderChrome({ isClient: false, account: { kind: "sign-in" } })
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/login")
    expect(screen.queryByRole("link", { name: "Account" })).toBeNull()

    rerender(
      <SiteChrome currentPath="/" isClient={true} isNarrow={false} account={{ kind: "account", onSignOut }}>
        <h1>Page heading</h1>
      </SiteChrome>,
    )
    expect(screen.getByRole("link", { name: "Account" })).toHaveAttribute("href", "/profile")
    await userEvent.click(screen.getByRole("button", { name: "Sign out" }))
    expect(onSignOut).toHaveBeenCalled()
  })
})
