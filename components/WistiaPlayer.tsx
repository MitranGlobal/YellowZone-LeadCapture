import { video } from '@/lib/config';

/**
 * Wistia embed, using the plain iframe rather than the <wistia-player> custom
 * element.
 *
 * The custom element needs two scripts to load and register before anything
 * renders, and any one of a module-type script being rewritten, a blocked
 * request, or a strict content blocker leaves the visitor with a blurred
 * placeholder and no video. The iframe has no such failure modes: it is a URL
 * in a box, it needs no JavaScript of ours, and it works identically on every
 * browser. For a paid-traffic landing page that reliability is worth more than
 * the player API we were not using.
 */
export default function WistiaPlayer() {
  const src = `https://fast.wistia.net/embed/iframe/${video.mediaId}?videoFoam=false&playerColor=E8A317`;

  return (
    <div className="border border-gold/35 bg-ink-deep p-1.5 shadow-raised sm:p-2">
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <iframe
          src={src}
          title="Yellow Zone assessment briefing"
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
          scrolling="no"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  );
}
