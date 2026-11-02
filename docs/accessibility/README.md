# Accessibility Contract

WCAG 2.2 Level AA is the engineering target. Do not claim legal compliance or
complete accessibility from automated tests alone.

## Design Agent

- Use compliant contrast and visible focus.
- Do not rely on color alone.
- Provide non-pointer alternatives for drag, hover, and gesture interactions.
- Design for 320px reflow and 200% text resizing.

## Architecture Agent

Every UI Feature RD inventories new controls and states and defines applicable
criteria for axe, keyboard operation, accessible names, focus management,
contrast, status announcements, alternative representations, and reflow.

## Implementation Agent

- Prefer native HTML semantics.
- Ensure every control has an accessible name.
- Preserve logical focus order, Escape behavior, and focus return.
- Announce important dynamic changes.
- Provide text alternatives for charts and informative images.
- Run automated and manual checks before marking accessibility criteria done.

