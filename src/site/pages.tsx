import { ContactDetails } from "./ContactDetails"
import { PageMeta } from "./PageMeta"
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
    <article className="page-block">
      <PageMeta title={route.title} description={route.description} />
      <h1>{route.heading}</h1>
      <p>
        Pet Rescue by Judy is a no-kill companion-animal rescue in Sanford, Florida. This site is the
        new public home for our work. Animal listings and applications will arrive in later updates.
      </p>
      <ul className="cta-list">
        <li><a className="button" href="/animals">See animals</a></li>
        <li><a className="button button-secondary" href="/adopt-foster">Adopt or foster</a></li>
        <li><a className="button button-secondary" href="/ways-to-give">Ways to give</a></li>
      </ul>
      <h2>Contact</h2>
      <ContactDetails />
    </article>
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
    <article className="page-block">
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
    <article className="page-block">
      <PageMeta title={route.title} description={route.description} />
      <h1>{route.heading}</h1>
      <HoldingCopy />
    </article>
  )
}
