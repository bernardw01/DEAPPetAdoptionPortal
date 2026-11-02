const menuButton = document.querySelector(".menu-button")
const primaryNav = document.querySelector(".primary-nav")

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true"
  menuButton.setAttribute("aria-expanded", String(!open))
  primaryNav?.setAttribute("data-open", String(!open))
})

primaryNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false")
    primaryNav.setAttribute("data-open", "false")
  })
})

document.querySelectorAll(".favorite").forEach((button) => {
  button.addEventListener("click", () => {
    const pressed = button.getAttribute("aria-pressed") === "true"
    button.setAttribute("aria-pressed", String(!pressed))
    button.textContent = pressed ? "♡" : "♥"
  })
})

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((item) => item.classList.remove("chip--active"))
    chip.classList.add("chip--active")
  })
})
