# Versioning and Releases

The template uses Semantic Versioning and publishes immutable Git tags and
GitHub Releases. A repository generated from the template is a snapshot; it
does not automatically receive later template releases.

## Version policy

- **Patch** (`0.3.0` to `0.3.1`): corrections, documentation improvements, and
  compatible maintenance changes.
- **Minor** (`0.3.0` to `0.4.0`): new template capabilities, governance rules,
  workflows, or compatible starter features.
- **Major** (`0.x` to `1.0.0`, then `1.x` to `2.0.0`): a stable `1.0` contract or
  a breaking change to bootstrap behavior, repository structure, governance,
  or generated applications.

Before `1.0.0`, a minor release may include a breaking improvement. Such a
change must be called out under `Breaking` in `CHANGELOG.md`.

## Authoritative version

`VERSION` is the human-readable source of truth. The following files must stay
synchronized, and `npm run version:check` enforces this:

- `VERSION`
- `package.json`
- the root package entries in `package-lock.json`
- `.ai/methodology-version.json` (`version` and `templateVersion`)
- the matching release heading in `CHANGELOG.md`

## Prepare a release

1. Finish and validate the approved Feature RD.
2. Choose the increment and run one of:

   ```bash
   npm run version:bump -- patch
   npm run version:bump -- minor
   npm run version:bump -- major
   npm run version:bump -- 1.0.0
   ```

3. Move the relevant entries from `Unreleased` into a dated heading such as
   `## [0.4.0] - 2026-11-15`, then update the comparison links.
4. Run `npm run sdlc:validate` and commit the release preparation.
5. Create and push an annotated tag matching `VERSION`:

   ```bash
   git tag -a v0.4.0 -m "Wasp AI Development Template v0.4.0"
   git push origin main v0.4.0
   ```

The release workflow verifies the tag and full template, extracts that
version's changelog section, and creates the corresponding GitHub Release.

## Updating generated applications

Generated repositories own their product code and project-specific rules.
Template changes should therefore be adopted deliberately: compare the
application's `.ai/methodology-version.json` with the desired release, review
the release notes, and port only the relevant shared-methodology changes in a
normal pull request. Never overwrite the generated application's PRD, Feature
RDs, implementation plan, or product code wholesale.
