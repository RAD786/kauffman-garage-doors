# Kauffman Garage Doors — kauffmangarage.com

Local lead-generation site for Kauffman Door Inc., a family owned garage door
company in Gainesville, GA. Next.js App Router + TypeScript + Tailwind CSS v4.

**Primary conversion goal is phone calls.** Form submissions are second. That
priority is baked into the layout everywhere — the red button is always the
phone number, and the form always says "calling is faster."

---

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (fully static, 33 routes)
npm start            # serve the production build
```

| Script | What it does |
| --- | --- |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run audit` | Layout pass: every page at 320/390/640/820/1440px. Horizontal overflow, one `<h1>`, missing alt text. 320px is the WCAG reflow floor and 640px is a 1280px desktop at 200% zoom. Screenshots to `.audit/`. |
| `npm run audit:seo` | Full crawl: titles, descriptions, canonicals, og/twitter tags, heading order, JSON-LD validity, colour contrast, tap-target sizes, broken links, dead fragments, boilerplate-aware duplicate-content detection, and Core Web Vitals. |
| `npm run test:form` | End-to-end lead form test: validation, value retention across a rejected submit, honeypot, successful submit. |
| `npm run logo` | Regenerates `logo-mark.png`, `logo-schema.png` and the favicons from `public/images/logo.png`. Only re-run if the client supplies new artwork. |

All four need the production build running on port 3111 (`npm run build && npx next start -p 3111`).

### About the duplicate-content check

`audit:seo` does not compare raw page text — that flags 45–50% "overlap" on any
site with a consistent CTA, form and footer inside `<main>`. Instead it hashes
every block-level text node, drops anything appearing on more than half the
pages as boilerplate, and compares only what remains. That is roughly how a
search engine separates template from content, and it is the number worth
acting on. Current editorial overlap between the ten city pages: none detected.

The audit scripts assume Edge at the default Windows path; change `EDGE` at the
top of `scripts/audit.mjs` for another machine.

---

## Before you go live

1. **Point `NEXT_PUBLIC_SITE_URL` at the real domain.** Copy `.env.example` to
   `.env.local`. Canonicals, OG tags, JSON-LD `@id`s and the sitemap all derive
   from it.
2. **Wire up lead delivery.** Without it, submissions are only written to the
   server log — the customer still sees a success message, so this is the one
   thing you must not forget. Set either `RESEND_API_KEY` + `LEAD_EMAIL_FROM`,
   or `LEAD_WEBHOOK_URL` (Zapier/Make/CRM), or both. See `.env.example`.
3. **Fill in the address** in `src/data/business.ts` if the shop takes walk-ins.
   If it's a service-area business, leave `street` empty — the schema helper
   omits it, and you should hide the address on the Google Business Profile too.
4. **Add the real social URLs** (`business.social`) — they become schema `sameAs`.
5. **Have someone read the copy.** It's written to be accurate and free of
   unsupported claims, but the owner should confirm the specifics: founding year
   (1984), hours, and the service-area towns.
6. **Legal review of `/privacy`** — and update it if you ever add analytics,
   call tracking or remarketing pixels. It currently states there are none.

---

## Where the content lives

Nearly all copy is data, not markup. Three files drive the whole site:

| File | Drives |
| --- | --- |
| `src/data/business.ts` | NAP, hours, founding year. **Single source of truth** — change the phone number here and it changes in every CTA, `tel:` link, schema block and the OG image. |
| `src/data/services.ts` | All 8 service pages |
| `src/data/cities.ts` | All 10 city pages |

Adding a service or city to its array automatically creates the page, the nav
dropdown entry, the footer link, the sitemap entry, the JSON-LD, and the
cross-links from every other page. No other file needs touching.

`src/data/faqs.ts` holds the sitewide FAQs; per-service and per-city FAQs live
on their own records so each page emits its own `FAQPage` schema.

### A note on the city pages

Each city's `intro` and `local` blocks are written specifically for that town —
county, ZIP codes, housing stock, what actually fails on doors there. This is
deliberate. Ten pages that are the same paragraph with the city name swapped is
the classic doorway-page pattern and Google discounts it. If you add a city,
write it real. The `neighborhoods` lists are the highest-value thing to improve:
put in the subdivisions you actually work in.

---

## SEO structure

- **Metadata** — every page goes through `buildMetadata()` in `src/lib/seo.ts`,
  so canonical + OG + Twitter tags can't drift apart.
- **JSON-LD** — `src/lib/schema.ts`. One `HomeAndConstructionBusiness`/`LocalBusiness`
  entity with a stable `@id` in the root layout, so Google connects the org
  across all pages instead of seeing a new business per URL. Service, city,
  FAQPage, BreadcrumbList and ContactPage schemas reference it by `@id`.
- **Sitemap + robots** — generated from the same data files as the pages
  (`src/app/sitemap.ts`, `robots.ts`), so a new page can't be left out.
- **Breadcrumbs** — the visible trail and the `BreadcrumbList` schema are built
  from the same `Crumb[]`, so they always match.
- **OG image** — generated at build time from `src/app/opengraph-image.tsx`, so
  there's no static PNG to keep in sync with the phone number.

---

## Performance

Every page is statically prerendered. ~103 kB shared First Load JS.

- Fonts are self-hosted by `next/font` (Inter + Barlow Condensed) — no
  third-party request, no layout shift.
- No icon library. All icons are inline SVG in `src/components/icons.tsx`.
- The FAQ accordions are native `<details>` — answers are in the HTML for
  crawlers and work with JavaScript disabled.
- The sticky mobile call bar is a server component with no JS, so it paints
  immediately rather than after hydration.
- The lead form is a server action, so it submits even if JS hasn't loaded.

### Image placeholders

`<PlaceholderImage>` renders an inline SVG stamped with its own pixel
dimensions wherever a real photo belongs. To swap in a real photo, drop it in
`public/images/` and pass `src`:

```tsx
<PlaceholderImage src="/images/hero.jpg" alt="..." width={1200} height={900} />
```

The reserved box is already the exact aspect ratio the photo needs, so adding
real photos cannot shift the layout. Search `<PlaceholderImage` to find all of
them — the `note` prop on each says what shot belongs there.

---

## The logo

The supplied `logo.png` is **already RGBA with a genuinely transparent
background** (verified: 73.6% of pixels fully transparent, zero dark fringe
pixels). It only *looks* like it has a black background when opened in a viewer
that composites transparency onto black.

`npm run logo` derives two things from it:

- `public/images/logo-mark.png` — cropped to the actual art bounds (989×560).
  Used in the header and footer, on no background at all. The navy line art
  reads on white; the white outline carries it on navy.
- `src/app/icon.png` / `apple-icon.png` — favicons. These *do* get a solid navy
  background on purpose: a transparent favicon with navy artwork disappears in a
  dark browser tab.

---

## Known SEO risks

Things that are correct today but could go wrong, in rough order of likelihood.

1. **The ten city pages are the fragile part of the strategy.** Each one carries
   roughly 350–450 words of genuinely local prose wrapped in shared chrome. That
   is defensible now. It stops being defensible the moment someone adds an
   eleventh city by copying a tenth and swapping the name. If you add a city,
   write the `intro`, `local` and `faqs` fields from scratch — and re-run
   `npm run audit:seo` to confirm editorial overlap stays clean.
2. **No reviews and no `aggregateRating`.** That is deliberate — inventing one is
   a manual-action risk. The cost is that the business shows no star rating in
   the SERP. The fix is collecting real Google reviews, not marking up fake ones.
3. **`/services/garage-door-repair` and `/service-areas/gainesville` target
   adjacent queries.** They are differentiated now (the service page is
   region-led, the city page is city-led) but they are the two pages most likely
   to cannibalise each other. If Google starts flip-flopping between them for
   "garage door repair gainesville", consolidate rather than fight it.
4. **Atlanta is a stretch.** It is the far edge of the service area, the most
   competitive market on the list, and the page says so honestly. Do not expect
   it to rank against intown Atlanta operators, and do not "fix" that by
   removing the honesty.
5. **Thin utility pages.** `/privacy` and `/accessibility` are short by nature.
   They are indexable because they are trust signals, but if they ever start
   drawing irrelevant impressions, `noindex` them via `buildMetadata`'s
   `noindex` flag.
6. **Local pack ranking is mostly not this website.** Proximity, the Google
   Business Profile and review volume dominate map results. The site supports
   that; it cannot substitute for it.

## Gotcha worth knowing

`FormState.attempt` in `src/lib/leads.ts` exists for a non-obvious reason, and
the form will break subtly if you remove it.

React 19 calls `form.reset()` once a server action resolves. A form reset
restores each `<select>` to the option carrying the `selected` **HTML
attribute** — and React sets the selected *property*, never the attribute. So
after a rejected submit the text inputs keep their echoed values (via their
`value` attribute) but the dropdowns silently blank out. A customer who
mistyped their phone number, fixed it and resubmitted would get a fresh "Pick
the service you need" error with the dropdowns mysteriously cleared.

The fix: `attempt` increments on every server response and the `<form>` is
keyed on it, so a rejected submit remounts the fields and React re-applies every
`defaultValue` from scratch. `npm run test:form` step 3 guards this.
# kauffman-garage-doors
