# Yellow Zone for Schools

Landing funnel for MiTran Global's Yellow Zone emotional wellbeing
certification.

**Flow:** Meta / WhatsApp ad → `/` (landing page, every CTA links through) →
`/briefing` (video + application form) → `/thank-you`.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16, App Router, TypeScript |
| Styling | Tailwind CSS v3 |
| 3D | Three.js + React Three Fiber (core only, no drei) |
| Motion | Framer Motion (UI), GSAP ScrollTrigger (scroll reveals) |
| Video | Self-hosted MP4 on Cloudinary, custom player |
| Form + scheduling | Tally embed |
| Hosting | Vercel |

The site is fully static — there are no API routes and no server-side state.

## Run it locally

```bash
npm install
cp .env.example .env.local     # optional; every value has a working default
npm run dev                    # http://localhost:3000
npm run build                  # production build
```

Node 20.9+ required (Node 22 LTS recommended — see `.nvmrc`).

## Project map

```
app/
  layout.tsx              fonts, metadata, GTM + Meta Pixel
  page.tsx                landing page
  briefing/page.tsx       video + application form (noindex)
  thank-you/page.tsx      post-submission confirmation
  privacy-policy/, terms/ legal pages
  robots.ts, sitemap.ts
components/
  Hero.tsx                hero copy + 3D medallion
  SealMedallion.tsx       the R3F certification medallion
  MeasureSection.tsx      the five certification criteria
  StepsSection.tsx        three-step route to certification
  VideoPlayer.tsx         custom MP4 player (ported from Framer)
  TallyEmbed.tsx          application form + slot, fires the submit pixel
  CtaButton.tsx           every CTA — a link to /briefing
  Nav, Footer, FinalCta, StickyCta, ScrollReveals
lib/
  config.ts               site details, offer wording, Tally URL, tracking ids
  content.ts              the five criteria, the three steps, objection cards
public/
  seal.png                texture for the 3D medallion
  logo.png, og.png, favicon.svg, seal.svg
```

## Things you will change first

Everything lives in **`lib/config.ts`** and **`lib/content.ts`** — no component
edits needed.

- `site.phone`, `site.email`, `site.whatsapp`
- `offer.name`, `offer.cohortName`, `offer.briefingMinutes`
- `lib/content.ts` — the five criteria, the three steps, the objection cards

## Integrations

**Application form.** `NEXT_PUBLIC_TALLY_SRC` points at the Tally embed, which
carries both the application questions and the appointment slot. It is the only
conversion point in the funnel.

Turn on **Tally → Settings → Notifications** so submissions reach your inbox.
The site holds no form state and sends no email of its own; Tally owns both.

**Video.** The MP4 is served from Cloudinary and plays inline in a custom
player. Override the URL with `NEXT_PUBLIC_VIDEO_SRC` and
`NEXT_PUBLIC_VIDEO_POSTER` if the asset moves.

**Tracking.** `NEXT_PUBLIC_GTM_ID` and `NEXT_PUBLIC_META_PIXEL_ID`. The site
fires `Schedule` to `fbq` and `application_submitted` to `dataLayer` when Tally
reports a submission, then forwards to `/thank-you`.

There is no payment step anywhere in this funnel.

## Deploy to Vercel

1. **Add New → Project → Import** your repository. Next.js is detected; leave
   the build settings at their defaults.
2. **Settings → General → Node.js Version:** 20.x or 22.x.
3. **Settings → Environment Variables:** add what you need from `.env.example`,
   for Production and Preview. `NEXT_PUBLIC_*` values are inlined at build
   time, so redeploy after changing one.
4. **Settings → Domains:** add `schools.mitranglobal.com` and point a CNAME at
   `cname.vercel-dns.com`.

## Upgrading over an older copy

Unzipping a release over an existing folder adds and overwrites files but never
deletes ones that were cut, and leftovers still import things that no longer
exist — which fails the build with `TS2305` / `TS2307`. Run:

```bash
bash cleanup-stale.sh
```

It whitelists what this release ships across `components/` and `lib/`, removes
`app/api/` and `types/`, and stages the deletions in git if the files were
tracked. Check with `git ls-files components/`.

A fresh clone, or unzipping into an empty directory, needs none of this.

## Notes

- **Accessibility.** Visible keyboard focus throughout, native `<details>`
  where used, and `prefers-reduced-motion` disables the scroll reveals and the
  medallion's motion. Video keyboard shortcuts are bound to the player element,
  not the document, so they cannot hijack typing in the form below.
- **The 3D medallion** falls back to a flat seal image while the canvas loads
  and on devices without WebGL, so the hero never renders empty.
- **Legal pages** are working drafts. Have your counsel review
  `app/privacy-policy/page.tsx` and `app/terms/page.tsx` before launch.
