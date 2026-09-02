import { video } from '@/lib/config';

/**
 * Vimeo embed for the sales video.
 *
 * A plain iframe, deliberately: no player SDK, no script to register, nothing
 * that can leave the visitor looking at an empty box if a request is blocked.
 * The Wistia custom element we used before failed exactly that way.
 *
 * Player appearance is controlled by URL parameters rather than CSS — an
 * iframe's internals cannot be styled from the parent page. See the README
 * for which parameters need a paid Vimeo plan.
 */
export default function VimeoPlayer() {
  const params = new URLSearchParams({
    badge: '0',
    autopause: '0',
    player_id: '0',
    app_id: '58479',
    title: '0', // hide the title overlay
    byline: '0', // hide the uploader byline
    portrait: '0', // hide the uploader avatar
    color: 'E8A317', // Yellow Zone gold on the scrubber (Vimeo Plus and above)
    dnt: '1', // no visitor tracking cookies from Vimeo
  });

  const src = `https://player.vimeo.com/video/${video.vimeoId}?${params.toString()}`;

  // No frame, padding or background: the player sits directly on the page.
  // Vimeo reports this video as 4:3, so the box is 75% of its width tall.
  // Hard-coding 56.25% here would letterbox it with black bars.
  return (
    <div className="relative w-full" style={{ paddingTop: video.aspectPadding }}>
      <iframe
        src={src}
        title="Yellow Zone — assessment briefing"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
