# SportAbility

Family-centered adaptive soccer website built with Next.js App Router, TypeScript, and vanilla CSS. Includes Home, Programs, About, Contact, Registration, and Privacy pages.

## Local development

Use Node.js 24.x and npm:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. No credentials are required to preview the site. With delivery configuration missing, forms show an honest unavailable notice and the business phone/email; they do not accept or discard applications silently.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

The npm lockfile pins installed dependencies. No Tailwind, database, account system, checkout, or CMS is used.

## Configure form delivery

Copy `.env.example` to `.env.local`. Forms use Server Actions, Zod validation, a honeypot, and SMTP.com's API, matching trends-frontend. No Turnstile is required.

Set `SMTP_API`, `SMTP_CHANNEL`, and optionally `FORM_FROM_EMAIL` (defaults to authenticated sender `contactforms@citryn.com`). Set `SITE_URL` to the canonical origin. Never commit secrets.

Notifications go to citryn.contactforms@gmail.com and sportabilityathletics@gmail.com, with the visitor as Reply-To. Both forms send branded HTML and plain text, plus a separate thank-you email to the visitor. Thank-you emails do not repeat athlete details. Failed acknowledgments do not reject accepted submissions.

Warm server instances coalesce unchanged retries for ten minutes. SMTP.com does not guarantee idempotency across instances or restarts. No website database is involved. Provider acceptance does not guarantee inbox placement.

## Content and brand

- Edit program information in `src/lib/content.ts`. Only the two current soccer offerings are selectable. Program CTA query values are validated against this collection.
- Keep the supplied `SportsAbility.svg` unchanged as the original brand asset. The website version in `public/brand/sportability.svg` and the site icon use the updated slogan: “Every Athlete. Empowered Through Sports”.
- Core colors, spacing, buttons, and typography live in `src/app/globals.css`; components use CSS Modules. Nunito Sans and Source Sans 3 are self-hosted by `next/font`.
- The theme is intentionally light. Motion is limited to interaction feedback, with reduced-motion support.
- Prices remain $210 and $300, with a separate $25 enrollment-fee note until the total is confirmed.
- Confirm the venue, ages served, schedule, session length, individual session count, staff names/credentials, and fee relationship before publishing more specific claims. No testimonials or staff identities have been invented.

## Images

The six final WebP photographs in `public/images` are AI-generated illustrative imagery, not actual program participants or staff. The footer discloses this. Replace them with consented real program photography when available.

| File | Scene |
| --- | --- |
| `hero-soccer.webp` | Child practicing a pass with coach and parent nearby |
| `group-soccer.webp` | Children taking turns during supported soccer play |
| `individual-soccer-clean.webp` | Coach supporting an athlete individually |
| `family-connection.webp` | Parent and child sharing a relaxed moment beside the field |
| `home-group-drills.webp` | Homepage-only group dribbling drill through cones on a natural-grass soccer field |
| `home-individual-passing.webp` | Homepage-only individual passing drill with a coach on a marked turf soccer pitch |

All six active images were generated with the built-in imagegen tool, then compressed to 1536 × 1024 WebP. The homepage program images show children doing drills with coaches on soccer fields, without parents or spectators. The two scenes use different children, clothing, drills, lighting, and camera angles. These are fictional illustrative settings, not claims about the program's actual venue. Other photographs use natural park settings. Earlier park, court, and gym variants remain in `public/images` as unused alternatives. The homepage uses dedicated `homeImage` entries in the typed program collection; the Programs page retains its separate photographs. The two homepage photo frames have equal widths and a 3:2 aspect ratio. Exact prompts for the current homepage images are recorded in `docs/homepage-image-prompts.md`.

## Verification

Run lint, typecheck, tests, and production build. SMTP tests use mocked provider responses and synthetic data. Real inbox placement requires a separate delivery check.
