import { video } from '@/lib/config';

/**
 * Wistia embed, using the plain iframe rather than the <wistia-player> custom
 * element. The custom element needs two scripts to load and register before
 * anything renders; the iframe is a URL in a box and has no such failure
 * modes. For a paid-traffic landing page that reliability is worth more than
 * a player API we were not using.
 *
 * If no embeddable media id is configured, we show a labelled link to the
 * video rather than a blank frame — a broken-looking box on the briefing
 * page would cost more bookings than an honest link does.
 */
export default function WistiaPlayer() {
  const { mediaId, shareUrl } = video;

  if (!mediaId) {
    return (
      <div className="border border-gold/35 bg-ink-deep p-1.5 sm:p-2">
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 bg-ink px-6 py-12 text-center sm:min-h-[320px]">
          <p className="text-[0.95rem] text-white/70">
            The assessment briefing opens in a new tab.
          </p>
          <a
            href={shareUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            Watch the briefing
          </a>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-white/35">
            Set NEXT_PUBLIC_WISTIA_MEDIA_ID to play it inline
          </p>
        </div>
      </div>
    );
  }

  const src = `https://fast.wistia.net/embed/iframe/${mediaId}?videoFoam=false&playerColor=E8A317`;

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
