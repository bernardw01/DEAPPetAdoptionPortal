export type PublicRoute = {
  path: string
  navLabel?: string
  heading: string
  title: string
  description: string
  kind: "home" | "holding" | "contact" | "auth"
}

export const primaryNav = [
  { label: "Home", href: "/" },
  { label: "Animals", href: "/animals" },
  { label: "Adopt / Foster", href: "/adopt-foster" },
  { label: "Surrender", href: "/surrender" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Ways to Give", href: "/ways-to-give" },
  { label: "Successes", href: "/successes" },
] as const

export const publicRoutes: PublicRoute[] = [
  {
    path: "/",
    navLabel: "Home",
    heading: "Your new best friend is waiting.",
    title: "Pet Rescue by Judy | Home",
    description: "Meet loving dogs and cats ready for adoption at Pet Rescue by Judy in Sanford, Florida. Find your match, foster, volunteer, or give.",
    kind: "home",
  },
  {
    path: "/animals",
    navLabel: "Animals",
    heading: "Animals",
    title: "Animals | Pet Rescue by Judy",
    description: "The animal catalog for Pet Rescue by Judy is coming soon. Contact the rescue for current animals.",
    kind: "holding",
  },
  {
    path: "/adopt-foster",
    navLabel: "Adopt / Foster",
    heading: "Adopt / Foster",
    title: "Adopt or Foster | Pet Rescue by Judy",
    description: "Adoption and foster information for Pet Rescue by Judy is coming soon. Contact the rescue to get started.",
    kind: "holding",
  },
  {
    path: "/surrender",
    navLabel: "Surrender",
    heading: "Surrender",
    title: "Surrender | Pet Rescue by Judy",
    description: "The surrender section for Pet Rescue by Judy is coming soon. Contact the rescue for current guidance.",
    kind: "holding",
  },
  {
    path: "/volunteer",
    navLabel: "Volunteer",
    heading: "Volunteer",
    title: "Volunteer | Pet Rescue by Judy",
    description: "Volunteer information for Pet Rescue by Judy is coming soon. Use the Volunteer Portal if you are already approved.",
    kind: "holding",
  },
  {
    path: "/ways-to-give",
    navLabel: "Ways to Give",
    heading: "Ways to Give",
    title: "Ways to Give | Pet Rescue by Judy",
    description: "Ways to give to Pet Rescue by Judy are coming soon. Contact the rescue to donate or help.",
    kind: "holding",
  },
  {
    path: "/successes",
    navLabel: "Successes",
    heading: "Successes",
    title: "Successes | Pet Rescue by Judy",
    description: "Success stories from Pet Rescue by Judy are coming soon.",
    kind: "holding",
  },
  {
    path: "/about",
    heading: "About Us",
    title: "About Us | Pet Rescue by Judy",
    description: "Learn who Pet Rescue by Judy is. A fuller about page is coming soon.",
    kind: "holding",
  },
  {
    path: "/contact",
    heading: "Contact Us",
    title: "Contact Us | Pet Rescue by Judy",
    description: "Address, phone, and email for Pet Rescue by Judy in Sanford, Florida.",
    kind: "contact",
  },
  {
    path: "/login",
    heading: "Sign in",
    title: "Sign in | Pet Rescue by Judy",
    description: "Sign in to your Pet Rescue by Judy account.",
    kind: "auth",
  },
  {
    path: "/signup",
    heading: "Create your account",
    title: "Create your account | Pet Rescue by Judy",
    description: "Create a Pet Rescue by Judy account using your email address.",
    kind: "auth",
  },
]

export const prerenderedPublicPaths = publicRoutes.map((route) => route.path)

export function routeByPath(path: string): PublicRoute {
  const match = publicRoutes.find((route) => route.path === path)
  if (!match) throw new Error(`Unknown public route: ${path}`)
  return match
}
