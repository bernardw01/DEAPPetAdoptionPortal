import { ContactDetails } from "./ContactDetails"
import { PageMeta } from "./PageMeta"
import { discoveryCard, featuredAnimals, heroAnimal, upcomingEvent } from "./fixtures"
import {
  AnimalCard,
  EventCard,
  Eyebrow,
  FilterChips,
  InvolvementCards,
  NewsletterForm,
  PetFinderForm,
  ProcessSteps,
  TrustStrip,
  Wrap,
} from "./primitives"
import { routeByPath } from "./publicRoutes"

function HoldingCopy() {
  return (
    <>
      <p>This section is coming soon. It does not yet include adoption policy, fees, or capacity details.</p>
      <p>If you need help now, contact Pet Rescue by Judy:</p>
      <ContactDetails />
    </>
  )
}

export function HomePage() {
  const route = routeByPath("/")
  return (
    <>
      <PageMeta title={route.title} description={route.description} />

      <section className="hero">
        <Wrap className="hero__grid">
          <div className="hero__content">
            <Eyebrow>Serving pets across Central Florida since 1986</Eyebrow>
            <h1>{route.heading}</h1>
            <p className="hero__intro">
              Meet loving dogs and cats ready for their next chapter. We’ll help you find the right fit for your home
              and family.
            </p>
            <PetFinderForm />
          </div>
          <div className="hero__visual" aria-label="Featured rescue dog">
            <div className="hero__arch">
              <img src={heroAnimal.image} alt={heroAnimal.alt} width={485} height={555} />
            </div>
            <a className="pet-note" href={heroAnimal.href}>
              <span className="pet-note__name">Meet {heroAnimal.name}</span>
              <span>{heroAnimal.summary}</span>
              <span className="pet-note__link">View her story →</span>
            </a>
            <span className="scribble scribble--one" aria-hidden="true">
              ♥
            </span>
            <span className="scribble scribble--two" aria-hidden="true">
              good dog!
            </span>
          </div>
        </Wrap>
      </section>

      <TrustStrip />

      <section id="pets" className="section pets-section">
        <Wrap>
          <div className="section-heading">
            <div>
              <Eyebrow>Ready to meet them?</Eyebrow>
              <h2>Pets looking for love</h2>
            </div>
            <a className="arrow-link" href="/animals">
              See all available pets <span aria-hidden="true">→</span>
            </a>
          </div>
          <FilterChips />
          <div className="pet-grid">
            {featuredAnimals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
            <article className="pet-card pet-card--discovery">
              <div className="pet-card__image pet-card__image--alternate">
                <img src={discoveryCard.image} alt={discoveryCard.alt} width={640} height={640} />
                <span className="badge badge--gold">Keep exploring</span>
              </div>
              <div className="pet-card__body">
                <p className="pet-card__meta">New friends arrive often</p>
                <h3>
                  <a href={discoveryCard.href}>Your match might be next</a>
                </h3>
                <p>Browse every available dog and cat, including seniors and special-needs pets.</p>
                <span className="card-link">View all pets →</span>
              </div>
            </article>
          </div>
        </Wrap>
      </section>

      <section id="process" className="section process-section">
        <Wrap className="process-grid">
          <div className="process-intro">
            <Eyebrow>A thoughtful match</Eyebrow>
            <h2>Adoption is a journey. We’re here for every step.</h2>
            <p>
              Our goal isn’t the fastest adoption—it’s the right home for every animal and the right companion for every
              family.
            </p>
            <a className="button button--outline" href="/adopt-foster">
              Read our adoption guide
            </a>
          </div>
          <ProcessSteps />
        </Wrap>
      </section>

      <section id="help" className="section help-section">
        <Wrap>
          <div className="section-heading section-heading--light">
            <div>
              <Eyebrow>More ways to help</Eyebrow>
              <h2>Every person can change a life.</h2>
            </div>
            <p>Adoption is only one way to make a difference. Give time, open your home, or help provide lifesaving care.</p>
          </div>
          <InvolvementCards />
        </Wrap>
      </section>

      <section id="events" className="section event-section">
        <Wrap>
          <EventCard {...upcomingEvent} />
        </Wrap>
      </section>

      <section className="newsletter">
        <Wrap className="newsletter__grid">
          <div>
            <Eyebrow>Good news, delivered</Eyebrow>
            <h2>Meet new arrivals and celebrate happy endings.</h2>
          </div>
          <NewsletterForm />
        </Wrap>
      </section>
    </>
  )
}

export function AnimalsPage() {
  return <HoldingPage path="/animals" />
}

export function AdoptFosterPage() {
  return <HoldingPage path="/adopt-foster" />
}

export function SurrenderPage() {
  return <HoldingPage path="/surrender" />
}

export function VolunteerPage() {
  return <HoldingPage path="/volunteer" />
}

export function WaysToGivePage() {
  return <HoldingPage path="/ways-to-give" />
}

export function SuccessesPage() {
  return <HoldingPage path="/successes" />
}

export function AboutPage() {
  return <HoldingPage path="/about" />
}

export function ContactPage() {
  const route = routeByPath("/contact")
  return (
    <article className="page-block wrap">
      <PageMeta title={route.title} description={route.description} />
      <h1>{route.heading}</h1>
      <p>Reach Pet Rescue by Judy using the details below. A contact form is not available yet.</p>
      <ContactDetails />
    </article>
  )
}

function HoldingPage({ path }: { path: string }) {
  const route = routeByPath(path)
  return (
    <article className="page-block wrap">
      <PageMeta title={route.title} description={route.description} />
      <h1>{route.heading}</h1>
      <HoldingCopy />
    </article>
  )
}
