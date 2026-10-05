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

Copy `.env.example` to `.env.local` for local configuration. Keep secrets out of Git. Both forms use Next.js Server Actions, server-side Zod validation, a honeypot, Cloudflare Turnstile, and plain-text Resend emails.

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Canonical production origin, such as your owned HTTPS domain |
| `RESEND_API_KEY` | Server-only Resend API key |
| `FORM_FROM_EMAIL` | Bare email address on an owned domain verified in Resend; no display-name wrapper |
| `FORM_TO_EMAIL` | Server-only recipient; defaults to `sportabilityathletics@gmail.com` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public Cloudflare widget key |
| `TURNSTILE_SECRET_KEY` | Server-only Cloudflare verification secret |
| `TURNSTILE_ALLOWED_HOSTNAMES` | Comma-separated exact hostnames, without scheme, port, or path |

The Gmail inbox is the recipient, not the sender. Verify your sending domain's DNS in Resend, create a sender on it, and set `FORM_FROM_EMAIL`. Parent email is used only as Reply-To; visitors cannot choose the recipient or sender.

Configure the Turnstile widget for the actual site hostname. The server checks hostname and the expected `contact` or `registration` action as well as verification success. Use Cloudflare's documented test keys only for local tests, never production. Redeploy after environment changes, especially the public site key.

Successful submission means Resend accepted the email, not that enrollment is approved or inbox delivery is guaranteed. A stable per-page nonce and an HMAC of the normalized email payload deduplicate unchanged provider retries for Resend's 24-hour window. Editing content changes the delivery key. Refreshing the page creates a new nonce. Form data survives errors in memory, but is not saved across refreshes and is never stored in local/session storage or written to application logs. A fresh Turnstile token is used on each retry.

Applications are stored by the email providers and the business inbox. No website database is involved. Provider accounts and inbox retention/access must be managed by the owner. The privacy page describes this actual flow without promising a retention period or regulatory certification.

## Deploy to Vercel

1. Import this project into Vercel with the Next.js framework preset and Node.js **24.x**. Use the repository root, `npm ci`, and `npm run build`; keep the default output directory.
2. Set environment variables from the table. Keep production recipients and secrets scoped to Production; use a separate test recipient and exact hostname list for previews if enabling their forms.
3. Attach the owned domain and set `SITE_URL` to its canonical HTTPS origin.
4. Deploy. Pages remain `noindex` unless Vercel marks the environment Production and `SITE_URL` is set. The registration page always stays `noindex`; the sitemap lists only indexable content pages.
5. Send one synthetic contact message and one synthetic application. Confirm inbox arrival, correct Reply-To, and no duplicate email after retry. Never test with real child data. Check Resend delivery status if messages do not arrive.

No custom Vercel adapter or `vercel.json` is needed. Until credentials are supplied, email delivery can be tested with mocks but cannot be verified end to end.

## Content and brand

- Edit program information in `src/lib/content.ts`. Only the two current soccer offerings are selectable. Program CTA query values are validated against this collection.
- Keep the supplied `SportsAbility.svg` unchanged; its exact copy is served from `public/brand/sportability.svg` and used as the site icon.
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

Focused mocked tests cover input validation, program allowlisting, consent, duplicated/file fields, missing configuration, honeypot rejection, verification expiry/action/hostname, provider failures, and retry deduplication. Browser review covers all routes, responsive layout, menu behavior, CTA preselection, and unavailable states. Live delivery needs configured provider credentials and a synthetic inbox test after deployment.

Implementation checks passed: ESLint, strict TypeScript, 29 focused tests, and the production build. All six pages were reviewed at 390px, 768px, and 1280px widths with no horizontal overflow or broken images. Keyboard checks covered navigation, menu dismissal, and FAQ controls.

Local production Lighthouse results: homepage desktop performance 100, mobile performance 90, accessibility 100, and best practices 100. Registration accessibility and best practices both scored 100. Mobile simulated LCP was 3.5 seconds with zero layout shift; real deployment performance can differ. Preview SEO scored 69 because indexing is intentionally blocked. Reports are saved in the ignored `test-results` directory. Lighthouse encountered a Windows temporary-profile cleanup error after successfully writing its reports.
