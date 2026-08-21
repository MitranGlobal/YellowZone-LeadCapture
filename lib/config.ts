/**
 * Single source of truth for anything the marketing team changes often:
 * scheduling link, seat count, contact details, video id, tracking ids.
 * Nothing else in the codebase should hard-code these values.
 */

const FALLBACK_URL = 'https://schools.mitranglobal.com';

/**
 * Resolves the canonical site URL defensively.
 *
 * `metadataBase: new URL(...)` throws at build time on a malformed value, and
 * the most common way to fill NEXT_PUBLIC_SITE_URL in a hosting dashboard is
 * to paste a bare domain with no scheme. So: add a missing scheme, drop a
 * trailing slash, fall back to the Vercel-provided host, and never let a bad
 * value take the build down.
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      const url = new URL(withScheme);
      if (!url.hostname.includes('.')) continue;
      return url.origin;
    } catch {
      // Malformed entry — try the next candidate.
    }
  }

  return FALLBACK_URL;
}

export const site = {
  name: 'Yellow Zone for Schools',
  org: 'MiTran Global',
  tagline: 'Every child has the right to feel #positive',
  url: resolveSiteUrl(),
  email: 'counselmitranglobal@gmail.com',
  phone: '+91 74832 59966',
  phoneHref: 'tel:+917483259966',
  whatsapp: 'https://wa.me/917483259966',
} as const;

export const offer = {
  /** What the school books on the briefing page. Free — no payment step. */
  name: 'Campus Readiness Audit',
  /** Cohort scarcity — keep this honest and update it when it changes. */
  cohortSeats: 12,
  seatsLeft: 5,
  cohortName: 'Founding Cohort 2026',
  briefingMinutes: 14,
} as const;

/**
 * Accepts whatever form of Wistia reference you paste in and returns the
 * media hashed ID, which is the only thing an embed URL can use.
 *
 * Recognised: a bare hashed ID, a /medias/<id> or /m/<id> account URL, or an
 * /embed/iframe/<id> URL. NOT recognised: a /s/<slug> share link — per
 * Wistia's docs the share slug is a separate identifier space and is not the
 * hashed ID, so it cannot be embedded. Get the ID from Wistia's
 * Embed & Share dialog instead.
 */
function resolveWistiaId(raw?: string): string {
  const value = raw?.trim();
  if (!value) return '';

  const fromPath = value.match(/\/(?:medias|m|embed\/iframe)\/([a-z0-9]{8,12})/i);
  if (fromPath) return fromPath[1];

  // A share link cannot be resolved client-side; treat it as unset.
  if (/\/s\//.test(value)) return '';

  if (/^[a-z0-9]{8,12}$/i.test(value)) return value;

  return '';
}

export const video = {
  /**
   * Set NEXT_PUBLIC_WISTIA_MEDIA_ID to the media hashed ID (about 10
   * characters). In Wistia: open the video, click Embed & Share, and copy the
   * id out of the embed code — it is the `media-id` attribute.
   */
  mediaId: resolveWistiaId(process.env.NEXT_PUBLIC_WISTIA_MEDIA_ID),
  /** Shown as a fallback link while no embeddable id is configured. */
  shareUrl:
    process.env.NEXT_PUBLIC_WISTIA_SHARE_URL ??
    'https://counselmitranglobal.wistia.com/s/b2ag5xkznld3bqt',
} as const;

export const tally = {
  /**
   * Tally embed URL. The form carries both the application questions and the
   * appointment slot, so it is the only conversion point in the funnel.
   * dynamicHeight lets Tally's script resize the iframe as the form grows.
   */
  src:
    process.env.NEXT_PUBLIC_TALLY_SRC ??
    'https://tally.so/embed/WOadLk?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1',
} as const;

export const tracking = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? '',
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '',
} as const;
