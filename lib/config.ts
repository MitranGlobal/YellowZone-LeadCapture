/**
 * Single source of truth for anything the marketing team changes often:
 * price, seat count, contact details, video id, tracking ids.
 * Nothing else in the codebase should hard-code these values.
 */

export const site = {
  name: 'Yellow Zone for Schools',
  org: 'MiTran Global',
  tagline: 'Every child has the right to feel #positive',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://schools.mitranglobal.com',
  email: 'counselmitranglobal@gmail.com',
  phone: '+91 74832 59966',
  phoneHref: 'tel:+917483259966',
  whatsapp: 'https://wa.me/917483259966',
} as const;

export const offer = {
  /** What the school books on the briefing page. */
  name: 'Campus Readiness Audit',
  /** Amount in rupees. Paise conversion happens in the payment route. */
  price: 999,
  priceLabel: '₹999',
  /** Shown struck through next to the price. Set to null to hide. */
  anchorLabel: '₹15,000',
  /** Cohort scarcity — keep this honest and update it when it changes. */
  cohortSeats: 12,
  seatsLeft: 5,
  cohortName: 'Founding Cohort 2026',
  refundWindowLabel: 'Full refund if we decline your campus',
  briefingMinutes: 14,
} as const;

export const video = {
  /** Wistia media id for the briefing video. */
  mediaId: process.env.NEXT_PUBLIC_WISTIA_MEDIA_ID ?? 'kudy2kfy6c',
  aspect: 1.7777777777777777,
} as const;

export const tracking = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? '',
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '',
} as const;

export const payment = {
  /**
   * When a Razorpay key is present the site opens Razorpay Checkout.
   * When it is not, the primary button falls back to this hosted
   * payment link so the funnel is never dead.
   */
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? '',
  fallbackLink: process.env.NEXT_PUBLIC_PAYMENT_LINK ?? '',
} as const;

export type LeadPayload = {
  schoolName: string;
  contactName: string;
  role: string;
  phone: string;
  email: string;
  city: string;
  strength: string;
  board: string;
  source?: string;
};
