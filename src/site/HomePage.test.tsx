/** @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { HomePage } from "./pages"
import { FavoriteButton, NewsletterForm, PetFinderForm } from "./primitives"

afterEach(() => {
  cleanup()
})

describe("homepage foundation", () => {
  it("AC-HOME-02: homepage renders hero, trust, pets, process, help, event, and newsletter sections", () => {
    const { container } = render(<HomePage />)
    expect(container.querySelector(".hero")).toBeTruthy()
    expect(container.querySelector(".trust-strip")).toBeTruthy()
    expect(container.querySelector(".pets-section")).toBeTruthy()
    expect(container.querySelector(".process-section")).toBeTruthy()
    expect(container.querySelector(".help-section")).toBeTruthy()
    expect(container.querySelector(".event-section")).toBeTruthy()
    expect(container.querySelector(".newsletter")).toBeTruthy()
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Your new best friend is waiting.")
  })

  it("AC-HOME-04: pet finder exposes labeled radios/selects and navigates via GET scaffolding", async () => {
    const assign = vi.fn()
    vi.stubGlobal("location", { ...window.location, assign })
    const user = userEvent.setup()
    render(<PetFinderForm />)
    expect(screen.getByRole("radio", { name: "Dogs" })).toBeChecked()
    expect(screen.getByLabelText("Age")).toBeTruthy()
    expect(screen.getByLabelText("Size")).toBeTruthy()
    await user.click(screen.getByRole("button", { name: /Find my match/ }))
    expect(assign).toHaveBeenCalledWith(expect.stringMatching(/^\/animals\?/))
    vi.unstubAllGlobals()
  })

  it("AC-HOME-04: newsletter form prevents functional subscribe", async () => {
    const user = userEvent.setup()
    render(<NewsletterForm />)
    await user.type(screen.getByLabelText("Email address"), "visitor@example.com")
    await user.click(screen.getByRole("button", { name: "Keep me posted" }))
    expect(screen.getByText(/Updates signup is not active yet/)).toBeTruthy()
  })

  it("AC-HOME-05: favorite toggles expose aria-pressed and accessible names", async () => {
    const user = userEvent.setup()
    render(<FavoriteButton name="Silas" />)
    const button = screen.getByRole("button", { name: "Add Silas to favorites" })
    expect(button).toHaveAttribute("aria-pressed", "false")
    await user.click(button)
    expect(button).toHaveAttribute("aria-pressed", "true")
    expect(button).toHaveAccessibleName("Remove Silas from favorites")
  })

  it("AC-FOUNDATION-04: shared primitives export animal card, trust, process, involvement, event, and forms", async () => {
    const primitives = await import("./primitives")
    for (const name of [
      "Wrap",
      "AnimalCard",
      "AnimalBadge",
      "FavoriteButton",
      "TrustStrip",
      "ProcessSteps",
      "InvolvementCards",
      "EventCard",
      "PetFinderForm",
      "NewsletterForm",
      "FilterChips",
      "ButtonLink",
      "Eyebrow",
    ]) {
      expect(primitives[name as keyof typeof primitives]).toBeTypeOf("function")
    }
  })
})
