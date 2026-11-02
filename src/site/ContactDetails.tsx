import { org } from "./org"

export function ContactDetails() {
  return (
    <address className="contact-details">
      <p>
        {org.addressLines.map((line) => (
          <span key={line}>
            {line}
            <br />
          </span>
        ))}
      </p>
      <p>
        <a href={org.phoneHref}>{org.phoneDisplay}</a>
      </p>
      <p>
        <a href={`mailto:${org.email}`}>{org.email}</a>
      </p>
    </address>
  )
}
