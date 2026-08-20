# Yellow Zone for Schools — landing funnel

Single-page marketing site for MiTran Global's Yellow Zone emotional
wellbeing certification, plus the briefing page the lead lands on after
submitting their details.

**Funnel:** Meta / WhatsApp ad → `/` (content + CTAs) → lead lightbox →
`/briefing` (Wistia video + offer) → payment → `/thank-you`.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 14, App Router, TypeScript |
| Styling | Tailwind CSS v3 |
| 3D | Three.js + React Three Fiber (`@react-three/drei`) |
| Motion | Framer Motion (UI + lightbox), GSAP ScrollTrigger (scroll reveals) |
| State | Zustand (lightbox / lead state) |
| Video | Wistia embed |
| Payments | Razorpay Checkout (with hosted-link fallback) |
| Hosting | Vercel |

## Run it locally

```bash
npm install
cp .env.example .env.local   # fill in what you have; blanks are handled
npm run dev                  # http://localhost:3000
```

```bash
npm run build && npm start   # production build
```

Node 18.17+ required (Node 20 LTS recommended).

## Project map

```
app/
  layout.tsx              fonts, metadata, GTM + Meta Pixel
  page.tsx                the landing page composition
  briefing/page.tsx       video page (noindex) — Wistia + offer + payment
  thank-you/page.tsx      post-payment confirmation
  privacy-policy/, terms/ legal pages
  api/lead/               receives the form, forwards to your CRM webhook
  api/payment/order/      creates a Razorpay order
  api/payment/verify/     verifies the payment signature server-side
components/
  Hero.tsx                hero copy + orchestrated load sequence
  SealMedallion.tsx       the R3F certification medallion
  LeadModal.tsx           Framer Motion lead lightbox
  ScrollReveals.tsx       one GSAP ScrollTrigger controller for the page
  PayButton.tsx           Razorpay checkout
  ...                     one file per section
lib/
  config.ts               price, seats, contact, video id, tracking ids
  content.ts              all page copy and structured content
  store.ts                Zustand lightbox store
public/
  seal.png                seal texture used by the 3D medallion
  logo.png, og.png, favicon.svg
```

## Things you will want to change first

Everything below lives in **`lib/config.ts`** and **`lib/content.ts`** — no
component edits needed.

- `offer.price` / `offer.priceLabel` — the audit fee (currently ₹999). The
  API route converts to paise automatically.
- `offer.seatsLeft` / `offer.cohortSeats` — keep these honest and update them
  as the cohort fills.
- `site.phone`, `site.email`, `site.whatsapp`.
- `lib/content.ts` — headline claims, the five domains, stages, FAQs,
  testimonials.

## Wiring up the integrations

**Leads.** Create an inbound webhook in GoHighLevel (or Zapier / Make) and put
the URL in `LEAD_WEBHOOK_URL`. Every submission posts JSON with the school
details, timestamp, user agent and referrer. Without the variable the site
still accepts leads and logs them server-side, so the funnel is never blocked.

**Video.** The briefing uses Wistia media id `kudy2kfy6c`. Change it with
`NEXT_PUBLIC_WISTIA_MEDIA_ID` — no code change.

**Payments.** Add `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_ID` and
`RAZORPAY_KEY_SECRET`. Checkout opens in-page, the signature is verified in
`/api/payment/verify`, and the visitor lands on `/thank-you`. If no key is
set the button falls back to `NEXT_PUBLIC_PAYMENT_LINK` (a Razorpay Payment
Page or similar), so you can go live before the gateway is approved.

**Tracking.** `NEXT_PUBLIC_GTM_ID` and `NEXT_PUBLIC_META_PIXEL_ID`. The site
fires `Lead` on form submit and `Purchase` on verified payment, both to
`dataLayer` and `fbq`. For Meta ad traffic, use `/briefing` as your custom
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
