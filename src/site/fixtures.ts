/**
 * Fixture animals for homepage cards/hero.
 * Provenance: public PRBJ RescueGroups-hosted photos copied from
 * docs/design/mockups/prbj-modern-home/assets/ for prototype use only.
 * Production animals come from the approved RG mirror or CMS.
 * Never assign a real animal’s image to a different identity.
 */
import silasImg from "./assets/silas.png"
import silasAltImg from "./assets/silas-2.jpg"
import sukiImg from "./assets/suki.jpg"
import logoImg from "./assets/prbj-logo.jpg"

export const brandLogo = {
  src: logoImg,
  alt: "Pet Rescue by Judy",
  /** Provisional JPG until client vector/master arrives (OQ-13). Do not redraw. */
  provisional: true,
} as const

export type FixtureAnimal = {
  id: string
  name: string
  species: "Dog" | "Cat"
  ageLabel: string
  breed: string
  traits: string[]
  badge: { label: string; tone: "brand" | "soft" | "gold" }
  image: string
  imageClass?: string
  alt: string
  href: string
}

export const featuredAnimals: FixtureAnimal[] = [
  {
    id: "silas",
    name: "Silas",
    species: "Dog",
    ageLabel: "5 months",
    breed: "Labrador Retriever / Basenji mix",
    traits: ["Good with dogs", "Good with kids"],
    badge: { label: "New arrival", tone: "brand" },
    image: silasImg,
    alt: "Silas, a tan and white rescue puppy",
    href: "/animals",
  },
  {
    id: "suki",
    name: "Suki",
    species: "Dog",
    ageLabel: "2 years",
    breed: "Labrador Retriever / Terrier mix",
    traits: ["House trained", "Medium"],
    badge: { label: "Foster home", tone: "soft" },
    image: sukiImg,
    imageClass: "pet-card__image--suki",
    alt: "Suki, a gray rescue dog with bright eyes",
    href: "/animals",
  },
]

export const heroAnimal = {
  name: "Suki",
  image: sukiImg,
  alt: "Suki, an adoptable rescue dog, smiling outside",
  summary: "2 years · House trained",
  href: "/animals",
} as const

export const discoveryCard = {
  image: silasAltImg,
  alt: "A PRBJ rescue puppy relaxing on a blanket",
  href: "/animals",
} as const

export const announcement = {
  text: "Adoption weekend: Meet dogs and cats Saturday in Sanford.",
  linkLabel: "View event details",
  href: "#events",
} as const

export const upcomingEvent = {
  day: "08",
  month: "Nov",
  ariaLabel: "November 8",
  title: "Sanford Food Truck Fiesta: Pints & Paws",
  summary: "Meet adoptable pets, connect with the PRBJ team, and enjoy an afternoon in downtown Sanford.",
  details: "1–6 PM · West End Trading Company · Sanford, FL",
  href: "/about",
} as const
