# Yellow Zone for Schools — landing funnel

Single-page marketing site for MiTran Global's Yellow Zone emotional
wellbeing certification, plus the briefing page the lead lands on after
submitting their details.

**Funnel:** Meta / WhatsApp ad → `/` (content + CTAs) → lead lightbox →
`/briefing` (Wistia video + offer) → payment → `/thank-you`.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16, App Router, TypeScript |
| Styling | Tailwind CSS v3 |
| 3D | Three.js + React Three Fiber (core only, no drei) |
| Motion | Framer Motion (UI + lightbox), GSAP ScrollTrigger (scroll reveals) |
| Video | Wistia embed |
| Form + scheduling | Tally embed |
| Hosting | Vercel |

## Upgrading over an older copy

If you unzip this release on top of a previous copy, delete the components that
no longer exist first. Unzipping overwrites files but never removes ones that
were cut, and the leftovers still import content exports that were deleted —
which fails the type check with `TS2305: has no exported member`.

```bash
bash cleanup-stale.sh
```

It works off a whitelist of the 13 components this release ships, so it clears
anything stale no matter which older version you came from. If the stale files
were committed to git it removes them from the index too — deleting them only
on disk is not enough, because CI builds what is in the repository:

```bash
git commit -m "Remove components cut in content trim" && git push
```

Check with `git ls-files components/` — it should list exactly 13 files.

A fresh clone, or unzipping into an empty directory, needs none of this.

## Run it locally

```bash
npm install
cp .env.example .env.local   # fill in what you have; blanks are handled
npm run dev                  # http://localhost:3000
```

```bash
npm run build && npm start   # production build
```

Node 20.9+ required (Node 22 LTS recommended — see `.nvmrc`).

## Dependency and security notes

This project was specced on Next.js 14. It now runs **Next.js 16 with React 19**,
because Next 14 cannot be made vulnerability-free: the latest Next 14 release
(14.2.35) still carries ~20 open advisories, and Next 15.5.x still carries 3.
Only 16.x audits clean. `npm audit` on this tree reports **0 vulnerabilities**.

`@react-three/drei` was also removed. Every 9.x release of drei pins the
deprecated `three-mesh-bvh@0.7.8`, and the only two helpers this project used
from it (`useTexture`, `ContactShadows`) are a few lines of three.js each. They
are now implemented directly in `components/SealMedallion.tsx`. This dropped the
dependency tree from roughly 400 packages to 133 and removed the deprecation
warning at its source.

If you must return to Next 14, pin `next` to `14.2.35`, `react`/`react-dom` to
`^18.3.1`, `@react-three/fiber` to `^8.18.0` and `framer-motion` to `^11.18.2`,
then delete `package-lock.json` and reinstall. The application code is
compatible with both; only the JSX namespace declaration in
`components/WistiaPlayer.tsx` is version-sensitive, and the form used there
works on React 18 and 19 alike.

## Project map

```
app/
  layout.tsx              fonts, metadata, GTM + Meta Pixel
  page.tsx                the landing page composition
  briefing/page.tsx       video page (noindex) — Wistia + offer + payment
  thank-you/page.tsx      post-payment confirmation
  privacy-policy/, terms/ legal pages
components/
  Hero.tsx                hero copy + 3D medallion
  SealMedallion.tsx       the R3F certification medallion
  MeasureSection.tsx      the five scored domains
  StepsSection.tsx        three-step route to certification
  FinalCta.tsx, Nav.tsx, Footer.tsx, StickyCta.tsx
  ScrollReveals.tsx       one GSAP ScrollTrigger controller for the page
  VimeoPlayer.tsx         Vimeo iframe embed
  TallyEmbed.tsx          application form + slot, fires the submit pixel
lib/
  config.ts               price, seats, contact, video id, tracking ids
  content.ts              all page copy and structured content
public/
  seal.png                seal texture used by the 3D medallion
  logo.png, og.png, favicon.svg
```

## Things you will want to change first

Everything below lives in **`lib/config.ts`** and **`lib/content.ts`** — no
component edits needed.

- `offer.seatsLeft` / `offer.cohortSeats` — keep these honest and update them
  as the cohort fills.
- `site.phone`, `site.email`, `site.whatsapp`.
- `lib/content.ts` — the five domains, the three steps, and the objection
  cards on the briefing page.

## Wiring up the integrations

**Leads.** Create an inbound webhook in GoHighLevel (or Zapier / Make) and put
the URL in `LEAD_WEBHOOK_URL`. Every submission posts JSON with the school
details, timestamp, user agent and referrer. Without the variable the site
still accepts leads and logs them server-side, so the funnel is never blocked.

**Video.** The briefing uses a Vimeo embed. Change the video with
`NEXT_PUBLIC_VIMEO_ID`, and its shape with `NEXT_PUBLIC_VIDEO_ASPECT` (`75%`
for 4:3, `56.25%` for 16:9) — no code change.

Player appearance is set by URL parameters in `components/VimeoPlayer.tsx`,
because an iframe's internals cannot be styled from the parent page. Currently
set: title, byline and avatar hidden; scrubber in Yellow Zone gold; Vimeo
tracking cookies off. The `color` parameter needs Vimeo Plus or above — on a
free plan it is ignored and the scrubber stays Vimeo blue. Other useful
parameters are `muted=1`, `loop=1`, `playsinline=1` and `controls=0`. Fully
custom controls would mean loading Vimeo's player SDK and building the UI
around it, which trades reliability for polish.

**Application form.** `NEXT_PUBLIC_TALLY_SRC` points at the Tally embed, which
carries both the application questions and the appointment slot. It is the only
conversion point in the funnel — every CTA on the landing page is a plain link
to `/briefing`, where the video sits above the form.

Turn on **Tally → Settings → Notifications** so submissions reach your inbox.
The site holds no form state and sends no email of its own; Tally owns both.

There is no payment step anywhere in this funnel.

**Tracking.** `NEXT_PUBLIC_GTM_ID` and `NEXT_PUBLIC_META_PIXEL_ID`. The site
fires `Schedule` to `fbq` and `application_submitted` to `dataLayer` when Tally
reports a submission, then forwards to `/thank-you`. For Meta ad traffic, use `/briefing` as your custom
conversion page and keep it excluded from indexing (already set).

## Push to git

From inside the project folder:

```bash
git init
git add .
git commit -m "Yellow Zone for Schools landing funnel"
git branch -M main
git remote add origin git@github.com:YOUR-ORG/yellow-zone-schools.git
git push -u origin main
```

Using HTTPS instead of SSH:

```bash
git remote add origin https://github.com/YOUR-ORG/yellow-zone-schools.git
```

`.gitignore` already excludes `node_modules`, `.next` and `.env*.local`.
Commit `.env.example`, never `.env.local`.

## Deploy to Vercel

1. **vercel.com → Add New → Project → Import** your repository.
2. Framework preset detects **Next.js**. Leave build command and output
   directory at their defaults.
3. **Settings → Environment Variables**: add every key from `.env.example`
   that you are using, for Production and Preview.
4. **Deploy.** Then **Settings → Domains** → add
   `schools.mitranglobal.com` and point a CNAME at `cname.vercel-dns.com`
   in your DNS.
5. Re-deploy after adding or changing environment variables — Next.js inlines
   `NEXT_PUBLIC_*` values at build time.

`NEXT_PUBLIC_SITE_URL` accepts a bare domain or a full URL — `lib/config.ts`
normalises it and falls back to the Vercel-provided host, so a missing scheme
cannot break the build. Set Node to 20.x or 22.x under **Settings → General →
Node.js Version** if it is not already.

CLI alternative:

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

## Notes

- **Accessibility.** Keyboard focus is visible throughout, the lightbox traps
  Escape and restores scroll, the FAQ uses native `<details>`, and
  `prefers-reduced-motion` disables the scroll reveals, the marquee and the
  medallion's motion.
- **The 3D medallion** degrades to a flat seal image while the canvas loads
  and on devices without WebGL, so the hero never renders empty.
- **Legal pages** are working drafts. Have your counsel review
  `app/privacy-policy/page.tsx` and `app/terms/page.tsx` before launch,
  particularly the student-data and refund clauses.
- **Claims discipline.** The figures on the page (127M students, 1.47M
  schools, 300+ teens mentored, 2,000+ trained) come from your own material.
  Keep them sourced — a certification body gets held to what it publishes.
