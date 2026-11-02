import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

const publicPaths = [
  "/",
  "/animals",
  "/adopt-foster",
  "/surrender",
  "/volunteer",
  "/ways-to-give",
  "/successes",
  "/about",
  "/contact",
  "/login",
  "/signup",
]

test("AC-SITE-01: unauthenticated visitors receive home, not login, and profile still requires sign in", async ({ page }) => {
  const home = await page.goto("/")
  expect(home?.ok()).toBeTruthy()
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Welcome to Pet Rescue by Judy")
  expect(page.url()).not.toContain("/login")

  await page.goto("/profile")
  await page.waitForURL(/\/login/)
})

test("AC-SITE-10: public routes do not request other origins", async ({ page }) => {
  const foreign = new Set<string>()
  page.on("request", (request) => {
    const url = new URL(request.url())
    const allowed = new Set(["http://127.0.0.1:4173", "http://localhost:4173"])
    if (!allowed.has(url.origin) && url.protocol !== "data:" && url.protocol !== "blob:") {
      foreign.add(`${url.origin}${url.pathname}`)
    }
  })
  for (const path of publicPaths) {
    await page.goto(path)
    await page.waitForLoadState("networkidle")
  }
  expect([...foreign]).toEqual([])
})

test("AC-SITE-11: login, signup and profile keep their headings and brand tokens", async ({ page }) => {
  await page.goto("/login")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sign in")
  await expect(page.getByLabel("Email address")).toBeVisible()
  const brand = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-brand").trim())
  expect(brand.toUpperCase()).toBe("#AE0303")

  await page.goto("/signup")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Create your account")
})

test("AC-PRERENDER-03: prerendered routes hydrate without console errors", async ({ page }) => {
  const errors: string[] = []
  page.on("console", (message) => {
    if (/hydrat/i.test(message.text()) || (message.type() === "error" && !/401|ERR_CONNECTION_REFUSED|Unauthorized/.test(message.text()))) {
      errors.push(message.text())
    }
  })
  page.on("pageerror", (error) => errors.push(error.message))
  for (const path of publicPaths) {
    await page.goto(path)
    await page.waitForLoadState("networkidle")
  }
  expect(errors).toEqual([])
})

test("AC-A11Y-01: public routes have no serious or critical axe violations at 320 and 1280", async ({ page }) => {
  for (const width of [320, 1280]) {
    await page.setViewportSize({ width, height: 800 })
    for (const path of publicPaths) {
      await page.goto(path)
      const results = await new AxeBuilder({ page }).analyze()
      const blocking = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))
      expect(blocking, `${path} at ${width}px`).toEqual([])
    }
  }
})

test("AC-A11Y-02: keyboard users can open the menu and reach each destination", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto("/")
  await page.locator("body").press("Tab")
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused()
  const menu = page.getByRole("button", { name: "Menu" })
  await menu.focus()
  await page.keyboard.press("Enter")
  await expect(menu).toHaveAttribute("aria-expanded", "true")
  await page.keyboard.press("Escape")
  await expect(menu).toBeFocused()
  await expect(menu).toHaveAttribute("aria-expanded", "false")
  await page.keyboard.press("Enter")
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Animals" }).press("Enter")
  await expect(page).toHaveURL(/\/animals$/)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Animals")
})

test("AC-A11Y-03: pages reflow at 320px without horizontal scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  for (const path of publicPaths) {
    await page.goto(path)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
    expect(overflow, path).toBe(false)
  }
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "32px"
  })
  const overflowZoomed = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
  expect(overflowZoomed).toBe(false)
})
