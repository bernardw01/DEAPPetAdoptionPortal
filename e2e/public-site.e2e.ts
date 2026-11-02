import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import path from "node:path"
import { fileURLToPath } from "node:url"

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

const evidenceDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "docs", "evidence", "010-platform-design")

test("AC-HOME-01: unauthenticated visitors receive home, not login, and profile still requires sign in", async ({ page }) => {
  const home = await page.goto("/")
  expect(home?.ok()).toBeTruthy()
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your new best friend is waiting.")
  expect(page.url()).not.toContain("/login")

  await page.goto("/profile")
  await page.waitForURL(/\/login/)
})

test("AC-HOME-02: homepage presents mockup hierarchy landmarks in order", async ({ page }) => {
  await page.goto("/")
  const order = await page.evaluate(() => {
    const selectors = [
      ".skip-link",
      ".announcement",
      ".site-header",
      ".hero",
      ".trust-strip",
      ".pets-section",
      ".process-section",
      ".help-section",
      ".event-section",
      ".newsletter",
      ".site-footer",
    ]
    return selectors.map((selector) => {
      const el = document.querySelector(selector)
      if (!el) return null
      return { selector, top: el.getBoundingClientRect().top + window.scrollY }
    })
  })
  expect(order.every(Boolean)).toBe(true)
  const tops = order.map((item) => item!.top)
  expect([...tops].sort((a, b) => a - b)).toEqual(tops)
  await expect(page.getByRole("button", { name: /Find my match/ })).toBeVisible()
  await expect(page.getByRole("button", { name: /Add Silas to favorites/ })).toBeVisible()
})

test("AC-HOME-04: pet finder and newsletter use labeled controls without backend submit", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("group", { name: "What kind of pet are you looking for?" })).toBeVisible()
  await expect(page.getByLabel("Age")).toBeVisible()
  await expect(page.getByLabel("Size")).toBeVisible()
  await expect(page.getByLabel("Email address")).toBeVisible()
  await page.getByLabel("Email address").fill("visitor@example.com")
  await page.getByRole("button", { name: "Keep me posted" }).click()
  await expect(page).toHaveURL(/\/$/)
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
  for (const pathName of publicPaths) {
    await page.goto(pathName)
    await page.waitForLoadState("networkidle")
  }
  expect([...foreign]).toEqual([])
})

test("AC-HOME-10: login, signup and profile keep their headings and brand tokens", async ({ page }) => {
  await page.goto("/login")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sign in")
  await expect(page.getByLabel("Email address")).toBeVisible()
  const brand = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--brand").trim())
  expect(brand.toUpperCase()).toBe("#AE0303")

  await page.goto("/signup")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Create your account")
})

test("AC-HOME-09 / AC-PRERENDER-03: prerendered routes hydrate without console errors", async ({ page }) => {
  const errors: string[] = []
  page.on("console", (message) => {
    if (/hydrat/i.test(message.text()) || (message.type() === "error" && !/401|ERR_CONNECTION_REFUSED|Unauthorized/.test(message.text()))) {
      errors.push(message.text())
    }
  })
  page.on("pageerror", (error) => errors.push(error.message))
  for (const pathName of publicPaths) {
    await page.goto(pathName)
    await page.waitForLoadState("networkidle")
  }
  expect(errors).toEqual([])
})

test("AC-A11Y-01: public homepage and shell have no serious or critical axe violations at 320 and 1280", async ({ page }) => {
  for (const width of [320, 1280]) {
    await page.setViewportSize({ width, height: 800 })
    for (const pathName of publicPaths) {
      await page.goto(pathName)
      const results = await new AxeBuilder({ page }).analyze()
      const blocking = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))
      expect(blocking, `${pathName} at ${width}px`).toEqual([])
    }
  }
})

test("AC-A11Y-02 / AC-HOME-07: keyboard users can open the menu, operate finder, and toggle favorites", async ({ page }) => {
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

  await page.goto("/")
  await page.setViewportSize({ width: 1280, height: 900 })
  const favorite = page.getByRole("button", { name: /Silas to favorites/ })
  await expect(favorite).toHaveAttribute("aria-pressed", "false")
  await favorite.focus()
  await page.keyboard.press("Enter")
  await expect(page.getByRole("button", { name: /Remove Silas from favorites/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  )
  await expect(page.getByRole("radio", { name: "Dogs" })).toBeVisible()
})

test("AC-A11Y-03 / AC-HOME-06: pages reflow at 320px without horizontal scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  for (const pathName of publicPaths) {
    await page.goto(pathName)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
    expect(overflow, pathName).toBe(false)
  }
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "32px"
  })
  const overflowZoomed = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
  expect(overflowZoomed).toBe(false)
})

test("AC-VIS-01: screenshots at representative widths", async ({ page }) => {
  const widths = [1280, 768, 390, 320]
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    await page.screenshot({
      path: path.join(evidenceDir, `home-${width}.png`),
      fullPage: true,
    })
  }
})
