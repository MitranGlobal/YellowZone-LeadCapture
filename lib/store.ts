'use client';

import { create } from 'zustand';

type LightboxSource =
  | 'nav'
  | 'hero'
  | 'framework'
  | 'path'
  | 'final'
  | 'sticky'
  | 'briefing'
  | 'unknown';

type LightboxState = {
  /** Lead-capture lightbox on the landing page. */
  isOpen: boolean;
  /** Which CTA opened it — forwarded to the CRM as the lead source. */
  source: LightboxSource;
  /** Set once a lead submits, so repeat CTAs skip straight to the briefing. */
  hasSubmitted: boolean;
  open: (source?: LightboxSource) => void;
  close: () => void;
  markSubmitted: () => void;
};

export const useLightbox = create<LightboxState>((set) => ({
  isOpen: false,
  source: 'unknown',
  hasSubmitted: false,
  open: (source = 'unknown') => set({ isOpen: true, source }),
  close: () => set({ isOpen: false }),
  markSubmitted: () => set({ hasSubmitted: true, isOpen: false }),
}));
