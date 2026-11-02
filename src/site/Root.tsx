import { useEffect, useState } from "react"
import { Outlet, useLocation } from "react-router"
import { logout, useAuth } from "wasp/client/auth"
import { SiteChrome } from "./SiteChrome"
import { useIsClient } from "./useIsClient"
import "../main.css"

/** Baseline menu collapse at 980px. */
const NARROW_QUERY = "(max-width: 980px)"

export function Root() {
  const { pathname } = useLocation()
  const isClient = useIsClient()
  const { data: user } = useAuth()
  const [isNarrow, setIsNarrow] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(NARROW_QUERY)
    const update = () => setIsNarrow(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  const account =
    isClient && user
      ? { kind: "account" as const, onSignOut: () => void logout() }
      : { kind: "sign-in" as const }

  return (
    <SiteChrome currentPath={pathname} isClient={isClient} isNarrow={isNarrow} account={account}>
      <Outlet />
    </SiteChrome>
  )
}
