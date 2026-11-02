# Open Questions

Status: living. Each item has a recommended default we will proceed on unless
told otherwise, an owner who can answer, and what it blocks. Answers that change
scope, cost or the client contract are Bernard's decision.

Owners: **Judy** (rescue owner), **Barb** (PRBJ website admin and RG account
holder), **Bernard** (DEAP), **RG** (RescueGroups support).

Blocks: **Build** = blocks starting that area; **Launch** = blocks go live;
**Risk** = does not block but can hurt.

| ID | Question | Recommended default | Owner | Blocks |
|---|---|---|---|---|
| OQ-01 | Contract and scope: no SOW exists, Judy has not replied since Oct 23. How does the separate Joey Barto contract proposal relate (same rebuild at a contract rate)? | Fixed scope SOW per phase from this plan; decide with Joey before any client commitment | Bernard, Judy | Build |
| OQ-02 | Who controls DNS and where is mail hosted for petrescuebyjudy.com? | Keep MX, SPF and DKIM records untouched; only change web records at cutover | Barb, Judy | Launch |
| OQ-03 | RG key: confirm Public flip procedure, one key per service, and whether staging can use the same key | Separate keys for staging and production if RG allows | Bernard, RG | Launch |
| OQ-04 | May staging use production RG data with a Private key (password protected, not indexed), since test data is sparse? | Yes, if RG confirms; otherwise rely on test API plus fixtures | RG | Risk |
| OQ-05 | Should applications also be pushed back into RG (needs private v2 credentials not requested)? | No. Keep in our system, email notification only | Judy, Barb | Build (scope) |
| OQ-06 | Hosting account ownership and monthly cost ceiling (proposed USD 50)? Who pays Railway and email providers? | DEAP owns infrastructure and bills a hosting retainer; document transfer path | Bernard, Judy | Build (cost) |
| OQ-07 | Retention schedule for applicant data (proposed: drafts 30 days, declined 12 months, approved 3 years, contact messages 12 months) | Adopt proposal, get written sign-off; consider legal review | Judy | Build |
| OQ-08 | May guests submit applications without an account? | **Closed 2026-11-02 (Product Owner): no, an account is required** (PRD 0.4.0, FR-014) | Bernard | Closed |
| OQ-09 | What goes in the applicant copy email and who receives full forms today? | Staff get a link only; applicant gets their own answers | Judy, Barb | Build |
| OQ-10 | Field lists for the cat, foster, Dog 4 a Day and volunteer applications (embedded forms not captured). **Cat form captured 2026-11-02** (RD 012); foster, Dog 4 a Day and volunteer remain | Draft each form RD with known fields and update the RDs as Barb supplies lists (Product Owner decision 2026-11-02); capture by walking each form logged in | Barb | Final approval of each form RD only |
| OQ-11 | Volunteer minimum age: 15 or 18? | 18 unless Judy confirms a youth path | Judy | Build |
| OQ-12 | Adoption fee wording: detail pages show a fee, policy gives ranges ($150 to $350 dogs, $40 to $150 cats) | Show RG fee string when present, else the policy range with the policy link | Judy | Risk |
| OQ-13 | Logo files, photography with usage rights, flyers in original formats | See design direction section 8 | Judy, Barb | Launch |
| OQ-14 | Content export from the RG CMS: full page, event, story and form inventory plus old URL list | Crawl the live site, then confirm with Barb; Barb exports what the CMS allows | Barb, Bernard | Build (Phase 4) |
| OQ-15 | Do staff use Google accounts (for Google sign in with their own two step verification)? | Offer Google sign in for staff if yes; else email and password | Barb | Build (Phase 2) |
| OQ-16 | Real naming tags in RG animal names (FH, TRAINING CAMP, TRAINING CAMP GRADUATE): exact patterns, and does RG have a structured field for them? | Parse names, verify with call V14 | Barb | Build |
| OQ-17 | How do MyRescue alerts work today and who uses them? | Rebuild as saved criteria with email alerts | Barb | Risk |
| OQ-18 | Oviedo Mall adoption center: current hours and whether it appears on the site | Include as an events or locations block if still active | Judy | Risk |
| OQ-19 | Exact Florida solicitation disclosure text and 501(c)(3) wording; PayPal and Venmo details | Copy verbatim from the live page at build time; locked block | Judy, Barb | Launch |
| OQ-20 | The RG key terms require the Pet Adoption Tracker image on every public pet detail page: where to obtain it and exact placement | Place in the animal page footer area; confirm with RG | Bernard, RG | Launch |
| OQ-21 | Email sender domain and who can add SPF and DKIM records | Send from a PRBJ subdomain such as mail.petrescuebyjudy.com | Barb | Launch |
| OQ-22 | Analytics and cookie consent | Cookieless analytics, no consent banner needed; Judy approves | Bernard, Judy | Risk |
| OQ-23 | Who flips the surrender capacity banner and how fast should changes appear? | Editors; changes live within a minute | Judy | Risk |
| OQ-24 | Wasp prerendering depth: docs confirm static routes and enumerated dynamic paths, but not head and meta handling or build-time data; per request SSR is roadmap | Prerender wherever possible (Product Owner decision 2026-11-02); RD 009 proves static routes, spike S1 settles data-driven routes | Bernard | Build (S1) |
| OQ-25 | Animal count, adoption volume, current monthly traffic and peak patterns | Assume a few hundred animals, low thousands of visits per month; measure | Barb | Risk |
| OQ-26 | Who receives notifications (applications, contact, stories) and expected response times? | Shared inbox plus named reviewers | Judy | Build |
| OQ-27 | Volgistics portal: stay as an external link only? | Yes, link out | Judy | Risk |
| OQ-28 | Named rescue contact for alerts and for approving content and design decisions | Barb as operations contact, Judy as approver | Judy | Build |
| OQ-29 | Is the Pet Adoption Tracker image, or any RG "Powered by" credit, preferred on the footer? | Follow terms; credit optional | RG | Risk |
| OQ-31 | Public URL slugs for the primary sections (/adopt-foster, /ways-to-give, /successes) become permanent and feed the redirect map | Accept the slugs in Feature RD 009 | Bernard, Judy | Build (RD 009) |
| OQ-30 | Domain for staging and email deliverability test addresses | Use a DEAP subdomain for staging | Bernard | Build |
| OQ-32 | Cat form: confirm the field list and which fields are required; the live form requires "Comments", RD 012 makes it optional. Judy to approve the certification wording and the privacy copy that discloses date of birth | Optional comments; certification text copied verbatim and versioned | Judy, Barb | Final approval of RD 012 |
| OQ-33 | What an applicant sees for each status, and for declines | Plain status names, no notes, no reasons | Judy | Build (reviewer RD) |
| OQ-34 | Draft rules: 30 day sliding expiry, at most 3 open cat drafts per applicant (Product Owner left as drafted 2026-11-02) | Adopt as written | Judy | Build |
| OQ-35 | Minimum applicant age for cat adoption (form asks Age, no rule stated) | No automated gate; reviewers decide | Judy | Risk |

## Seeded from the synopsis (section 6)

- Scope and contract, Joey Barto: OQ-01
- API key status and one key per site: OQ-03, OQ-04
- Applications into RG: OQ-05
- v5 beta risk: mitigated by the adapter (ADR 0006); no question needed
- Test data rules: environment matrix in architecture section 8
- Content ownership, DNS control: OQ-02, OQ-14
- Items not captured: OQ-10, OQ-13, OQ-17, OQ-18
- Live site inconsistencies: OQ-11, OQ-12
- Payments in person: no online checkout; recorded in the PRD non-goals
