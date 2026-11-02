import { type FormEvent, type ReactNode, useState } from "react"
import type { FixtureAnimal } from "./fixtures"

export function Wrap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`wrap ${className}`.trim()}>{children}</div>
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>
}

export function ButtonLink({
  href,
  children,
  className = "",
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <a className={`button ${className}`.trim()} href={href}>
      {children}
    </a>
  )
}

export function FavoriteButton({ name }: { name: string }) {
  const [pressed, setPressed] = useState(false)
  return (
    <button
      type="button"
      className="favorite"
      aria-label={pressed ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
      aria-pressed={pressed}
      onClick={() => setPressed((value) => !value)}
    >
      <span aria-hidden="true">{pressed ? "♥" : "♡"}</span>
    </button>
  )
}

export function AnimalBadge({ label, tone }: { label: string; tone: "brand" | "soft" | "gold" }) {
  const toneClass = tone === "soft" ? "badge badge--soft" : tone === "gold" ? "badge badge--gold" : "badge"
  return <span className={toneClass}>{label}</span>
}

export function AnimalCard({ animal }: { animal: FixtureAnimal }) {
  return (
    <article className="pet-card">
      <div className={`pet-card__image ${animal.imageClass ?? ""}`.trim()}>
        <img src={animal.image} alt={animal.alt} width={640} height={640} />
        <AnimalBadge label={animal.badge.label} tone={animal.badge.tone} />
        <FavoriteButton name={animal.name} />
      </div>
      <div className="pet-card__body">
        <p className="pet-card__meta">
          {animal.species} · {animal.ageLabel}
        </p>
        <h3>
          <a href={animal.href}>{animal.name}</a>
        </h3>
        <p>{animal.breed}</p>
        <div className="traits">
          {animal.traits.map((trait) => (
            <span key={trait}>{trait}</span>
          ))}
        </div>
      </div>
    </article>
  )
}

export function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="About Pet Rescue by Judy">
      <Wrap className="trust-strip__grid">
        <p>
          <strong>No-kill rescue</strong>
          <span>Every life matters</span>
        </p>
        <p>
          <strong>Sanford, Florida</strong>
          <span>Serving Central Florida</span>
        </p>
        <p>
          <strong>Right pet, right home</strong>
          <span>Thoughtful matching</span>
        </p>
        <p>
          <strong>501(c)(3) nonprofit</strong>
          <span>Community supported</span>
        </p>
      </Wrap>
    </section>
  )
}

export function ProcessSteps() {
  return (
    <ol className="steps">
      <li>
        <span>1</span>
        <div>
          <h3>Find a pet</h3>
          <p>Browse profiles and learn who may fit your life.</p>
        </div>
      </li>
      <li>
        <span>2</span>
        <div>
          <h3>Apply online</h3>
          <p>Tell us about your home, family, and experience.</p>
        </div>
      </li>
      <li>
        <span>3</span>
        <div>
          <h3>Meet your match</h3>
          <p>Our team reviews your application and arranges a visit.</p>
        </div>
      </li>
      <li>
        <span>4</span>
        <div>
          <h3>Welcome them home</h3>
          <p>Complete the adoption and begin your life together.</p>
        </div>
      </li>
    </ol>
  )
}

export function InvolvementCards() {
  return (
    <div className="help-grid">
      <a href="/adopt-foster">
        <span className="help-icon" aria-hidden="true">
          ⌂
        </span>
        <h3>Foster a pet</h3>
        <p>Give a dog or cat a safe place to land.</p>
        <span>Learn about fostering →</span>
      </a>
      <a href="/volunteer">
        <span className="help-icon" aria-hidden="true">
          ♥
        </span>
        <h3>Volunteer</h3>
        <p>Share your time and talents with the rescue.</p>
        <span>See volunteer options →</span>
      </a>
      <a id="give" href="/ways-to-give">
        <span className="help-icon" aria-hidden="true">
          ✦
        </span>
        <h3>Make a gift</h3>
        <p>Fund food, medicine, shelter, and second chances.</p>
        <span>Choose how to give →</span>
      </a>
    </div>
  )
}

export function EventCard({
  day,
  month,
  ariaLabel,
  title,
  summary,
  details,
  href,
}: {
  day: string
  month: string
  ariaLabel: string
  title: string
  summary: string
  details: string
  href: string
}) {
  return (
    <div className="event-card">
      <div className="event-date" aria-label={ariaLabel}>
        <strong>{day}</strong>
        <span>{month}</span>
      </div>
      <div className="event-copy">
        <Eyebrow>Upcoming community event</Eyebrow>
        <h2>{title}</h2>
        <p>{summary}</p>
        <p className="event-details">
          <strong>{details}</strong>
        </p>
      </div>
      <a className="button" href={href}>
        Event details
      </a>
    </div>
  )
}

export function PetFinderForm() {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const params = new URLSearchParams()
    const pet = String(data.get("pet") ?? "all")
    const age = String(data.get("age") ?? "")
    const size = String(data.get("size") ?? "")
    if (pet) params.set("pet", pet)
    if (age && age !== "Any age") params.set("age", age)
    if (size && size !== "Any size") params.set("size", size)
    window.location.assign(`/animals?${params.toString()}`)
  }

  return (
    <form className="pet-finder" method="get" action="/animals" onSubmit={onSubmit}>
      <fieldset className="pet-toggle">
        <legend>What kind of pet are you looking for?</legend>
        <label>
          <input type="radio" name="pet" value="dog" defaultChecked />
          <span>Dogs</span>
        </label>
        <label>
          <input type="radio" name="pet" value="cat" />
          <span>Cats</span>
        </label>
        <label>
          <input type="radio" name="pet" value="all" />
          <span>All pets</span>
        </label>
      </fieldset>
      <div className="finder-row">
        <label className="select-field">
          <span className="visually-hidden">Age</span>
          <select name="age" defaultValue="Any age">
            <option>Any age</option>
            <option>Baby</option>
            <option>Young</option>
            <option>Adult</option>
            <option>Senior</option>
          </select>
        </label>
        <label className="select-field">
          <span className="visually-hidden">Size</span>
          <select name="size" defaultValue="Any size">
            <option>Any size</option>
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </select>
        </label>
        <button className="button finder-button" type="submit">
          Find my match <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  )
}

export function NewsletterForm() {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <form className="newsletter-form" onSubmit={onSubmit}>
      <label htmlFor="newsletter-email">Email address</label>
      <div>
        <input id="newsletter-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
        <button className="button" type="submit">
          Keep me posted
        </button>
      </div>
      <p>Updates signup is not active yet. Nothing is submitted or stored.</p>
    </form>
  )
}

export function FilterChips() {
  const [active, setActive] = useState("Recently arrived")
  const chips = ["Recently arrived", "Dogs", "Cats", "Seniors", "Special needs", "Needs a foster"]
  return (
    <div className="quick-filters" aria-label="Quick animal filters">
      {chips.map((chip) => (
        <button
          key={chip}
          type="button"
          className={chip === active ? "chip chip--active" : "chip"}
          aria-pressed={chip === active}
          onClick={() => setActive(chip)}
        >
          {chip}
        </button>
      ))}
    </div>
  )
}
