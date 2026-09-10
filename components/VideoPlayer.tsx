'use client';

import type { CSSProperties } from 'react';
import { useEffect, useRef } from 'react';

/**
 * Video source lives here rather than in lib/config so this component has no
 * dependency on the shape of anything else in the project — it cannot break
 * because a config export was renamed. Override either value with an
 * environment variable; Next inlines NEXT_PUBLIC_* at build time.
 */
const DEFAULT_SRC =
  process.env.NEXT_PUBLIC_VIDEO_SRC ??
  'https://res.cloudinary.com/twteccae/video/upload/Yellow_Zone_V2_kvfb8m.mp4';

/** Cloudinary renders a still from the same asset when you swap the extension. */
const DEFAULT_POSTER =
  process.env.NEXT_PUBLIC_VIDEO_POSTER ??
  'https://res.cloudinary.com/twteccae/video/upload/Yellow_Zone_V2_kvfb8m.jpg';

/**
 * Custom video player, ported from the Framer component at
 * framer.com/m/Video-player-Pgauhy.js
 *
 * The original is a Framer code component: it imports `addPropertyControls`,
 * `ControlType` and `useIsStaticRenderer` from the `framer` package, which
 * only exists inside Framer's runtime. Those are gone here, replaced by real
 * props. Three other things were changed deliberately:
 *
 *  - The YouTube and Vimeo branches are removed. We serve one MP4 from
 *    Cloudinary, and carrying two postMessage protocols we never use is
 *    surface area for nothing.
 *  - The drag-and-drop upload overlay and file picker are removed. They exist
 *    so a designer can swap the video on the Framer canvas; on a live landing
 *    page a "drop a file here" target is a bug, not a feature.
 *  - Keyboard shortcuts are bound to the player element rather than the
 *    document. Bound globally, pressing space anywhere on the page — including
 *    while the Tally form below has focus — would toggle playback.
 *
 * Everything that makes it feel good is kept: tap-to-play, double-tap either
 * side to skip 10s, press-and-hold for 2x, scrub with live frame previews,
 * speed menu, fullscreen, and the glass control bar.
 */

type Props = {
  src?: string;
  poster?: string;
  /** Start playing when scrolled into view. Browsers require muted autoplay. */
  autoplay?: boolean;
  autoMute?: boolean;
  loop?: boolean;
  /** Hide the full control bar, leaving only play and mute buttons. */
  minimal?: boolean;
  cornerRadius?: number;
  /** Progress bar fill. Defaults to Yellow Zone gold. */
  progressColor?: string;
};

export default function VideoPlayer({
  src = DEFAULT_SRC,
  poster = DEFAULT_POSTER,
  autoplay = false,
  autoMute = true,
  loop = false,
  minimal = false,
  cornerRadius = 12,
  progressColor = '#E8A317',
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const $ = <T extends Element = HTMLElement>(sel: string) =>
      root.querySelector(sel) as T;
    const $$ = (sel: string) =>
      Array.from(root.querySelectorAll(sel)) as HTMLElement[];

    const media = $('.media');
    const videoEl = $<HTMLVideoElement>('.video-el');
    const clickCatch = $('.click-catch');
    const controls = $('.controls');
    const speedBtn = $('.speed-btn');
    const speedPanel = $('.speed-panel');
    const muteBtn = $('.mute-btn');
    const muteIcon = muteBtn.querySelector('svg') as SVGElement;
    const fullscreenBtn = $('.fullscreen-btn');
    const progressWrap = $('.progress-wrap');
    const progressTrack = $('.progress-track');
    const progressFill = $('.progress-fill');
    const timeDisplay = $('.time-display');
    const seekIndicator = $('.seek-indicator');
    const seekIcon = $('.seek-icon');
    const seekLabel = $('.seek-label');
    const edgeLeft = $('.edge-left');
    const edgeRight = $('.edge-right');
    const framePreview = $('.frame-preview');
    const frameCanvas = $<HTMLCanvasElement>('.frame-canvas');
    const frameTimeLbl = $('.frame-time-label');
    const toast = $('.toast');
    const pw = $('.player-wrap');
    const ppFlashEl = $('.playpause-flash');
    const ppIcon = $('.pp-icon');
    const holdBadge = $('.hold-badge');
    const fsIcon = $('.fs-icon');
    const miniPlay = $('.mini-play');
    const miniPlayIcon = miniPlay.querySelector('svg') as SVGElement;
    const miniMute = $('.mini-mute');
    const miniMuteIcon = miniMute.querySelector('svg') as SVGElement;
    const replayBtn = $('.replay-btn');
    const replayIcon = replayBtn.querySelector('svg') as SVGElement;

    const ARR_L = '<polyline points="10,4 6,8 10,12"/>';
    const ARR_R = '<polyline points="6,4 10,8 6,12"/>';
    const MINI_PLAY =
      '<path d="M8 5.6v12.8l10.5-6.4z" fill="currentColor" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>';
    const MINI_PAUSE =
      '<rect x="7" y="5.5" width="3.6" height="13" rx="1.8" fill="currentColor"/><rect x="13.4" y="5.5" width="3.6" height="13" rx="1.8" fill="currentColor"/>';
    const REPLAY =
      '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></g>';
    const VOL_ON =
      '<path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16.5 8.5a4 4 0 010 7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>';
    const VOL_OFF =
      '<path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>';

    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    let currentSpeed = 1;
    let controlsTimeout: number | undefined;
    let toastTimer: number | undefined;
    let seekTimer: number | undefined;
    let ppTimer: number | undefined;
    let singleTapTimer: number | null = null;
    let lastTouchEnd = 0;
    let isDragging = false;
    let holdTimer: number | null = null;
    let isHolding = false;
    let didHold = false;
    let curPaused = true;
    let curVol = 1;
    let curMuted = autoMute;
    let inView = false;

    /* ---- Lazy scrub source -------------------------------------------
       The original loaded a second copy of the video with preload="auto"
       purely to paint hover thumbnails, doubling bandwidth for every
       visitor whether or not they ever touched the scrubber. This one is
       created on first hover and only fetches metadata. */
    let scrubVid: HTMLVideoElement | null = null;
    let canScrub = false;
    let lastScrubTime = -1;
    const offscreen = document.createElement('canvas');
    offscreen.width = 160;
    offscreen.height = 90;
    const offCtx = offscreen.getContext('2d');
    const SEEK_THRESH = 0.4;

    const onScrubSeeked = () => {
      if (!scrubVid || !offCtx) return;
      try {
        offCtx.drawImage(scrubVid, 0, 0, 160, 90);
        const ctx = frameCanvas.getContext('2d');
        if (!ctx) return;
        frameCanvas.width = 160;
        frameCanvas.height = 90;
        ctx.drawImage(offscreen, 0, 0);
      } catch {
        canScrub = false;
        framePreview.classList.remove('show');
      }
    };

    function ensureScrub() {
      if (scrubVid) return;
      scrubVid = document.createElement('video');
      scrubVid.muted = true;
      scrubVid.preload = 'metadata';
      scrubVid.playsInline = true;
      scrubVid.crossOrigin = 'anonymous';
      scrubVid.addEventListener('seeked', onScrubSeeked);
      scrubVid.src = src;
      scrubVid.load();
      canScrub = true;
    }

    function seekScrubTo(t: number) {
      if (!scrubVid || !scrubVid.src || isNaN(scrubVid.duration)) return;
      if (Math.abs(t - lastScrubTime) < SEEK_THRESH) return;
      lastScrubTime = t;
      scrubVid.currentTime = t;
    }

    /* ---- Small helpers ------------------------------------------------ */

    function showToast(msg: string) {
      toast.textContent = msg;
      toast.classList.add('show');
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(
        () => toast.classList.remove('show'),
        1600,
      );
    }

    function fmt(s: number) {
      if (isNaN(s) || s == null) return '0:00';
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = Math.floor(s % 60);
      return h > 0
        ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
        : `${m}:${String(sec).padStart(2, '0')}`;
    }

    function setAR(w: number, h: number) {
      if (w && h) media.style.setProperty('--ar', `${w} / ${h}`);
    }

    function pushTime(t: number, d: number) {
      if (!isDragging) progressFill.style.width = `${d ? (t / d) * 100 : 0}%`;
      timeDisplay.textContent = `${fmt(t)} / ${fmt(d)}`;
    }

    function updatePlayIcons() {
      miniPlayIcon.innerHTML = curPaused ? MINI_PLAY : MINI_PAUSE;
    }

    function updateMuteIcons() {
      muteIcon.innerHTML = curMuted ? VOL_OFF : VOL_ON;
      miniMuteIcon.innerHTML = curMuted ? VOL_OFF : VOL_ON;
    }

    function setPaused(p: boolean) {
      curPaused = p;
      updatePlayIcons();
    }

    function showReplay(b: boolean) {
      replayBtn.classList.toggle('show', b);
    }

    function applyMute(m: boolean) {
      curMuted = m;
      videoEl.muted = m;
      updateMuteIcons();
    }

    function flashEdge(side: 'left' | 'right') {
      const el = side === 'left' ? edgeLeft : edgeRight;
      el.classList.remove('flash-in');
      void el.offsetWidth;
      el.classList.add('flash-in');
      el.addEventListener('animationend', () => el.classList.remove('flash-in'), {
        once: true,
      });
    }

    function flashSeek(dir: 'back' | 'fwd') {
      seekIcon.innerHTML = dir === 'back' ? ARR_L : ARR_R;
      seekLabel.textContent = dir === 'back' ? '−10s' : '+10s';
      seekIndicator.style.left = dir === 'back' ? '22%' : 'auto';
      seekIndicator.style.right = dir === 'back' ? 'auto' : '22%';
      seekIndicator.style.transform = 'translateY(-50%)';
      seekIndicator.classList.add('show');
      window.clearTimeout(seekTimer);
      seekTimer = window.setTimeout(
        () => seekIndicator.classList.remove('show'),
        720,
      );
    }

    function flashPlayPause(isPlay: boolean) {
      if (root!.classList.contains('minimal')) return;
      ppIcon.innerHTML = isPlay ? MINI_PLAY : MINI_PAUSE;
      ppFlashEl.classList.remove('show');
      void ppFlashEl.offsetWidth;
      ppFlashEl.classList.add('show');
      window.clearTimeout(ppTimer);
      ppTimer = window.setTimeout(() => ppFlashEl.classList.remove('show'), 1100);
    }

    function togglePlay() {
      if (videoEl.paused) {
        void videoEl.play().catch(() => {});
        setPaused(false);
        showReplay(false);
        flashPlayPause(true);
      } else {
        videoEl.pause();
        setPaused(true);
        flashPlayPause(false);
      }
    }

    function seekAndAnimate(targetTime: number) {
      const dur = videoEl.duration || 0;
      const t = Math.max(0, Math.min(dur, targetTime));
      videoEl.currentTime = t;
      progressFill.classList.add('no-transition');
      progressFill.style.width = `${dur ? (t / dur) * 100 : 0}%`;
    }

    /* ---- Wire up the native element ----------------------------------- */

    videoEl.src = src;
    videoEl.muted = curMuted;
    videoEl.volume = curVol;
    videoEl.loop = loop;
    if (poster) videoEl.poster = poster;

    const onTime = () => pushTime(videoEl.currentTime, videoEl.duration || 0);
    const onMeta = () => {
      setAR(videoEl.videoWidth, videoEl.videoHeight);
      pushTime(videoEl.currentTime, videoEl.duration || 0);
    };
    const onPlay = () => setPaused(false);
    const onPause = () => setPaused(true);
    const onEnded = () => {
      if (!loop) {
        setPaused(true);
        showReplay(true);
      }
    };

    videoEl.addEventListener('timeupdate', onTime);
    videoEl.addEventListener('loadedmetadata', onMeta);
    videoEl.addEventListener('play', onPlay);
    videoEl.addEventListener('pause', onPause);
    videoEl.addEventListener('ended', onEnded);

    function autoStart() {
      applyMute(autoMute);
      void videoEl.play().catch(() => {});
      setPaused(false);
    }

    /* ---- Scrubbing ----------------------------------------------------- */

    function getPct(clientX: number) {
      const rect = progressTrack.getBoundingClientRect();
      return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    }

    function showFrameAt(pct: number, clientX: number) {
      if (!canScrub) return;
      const dur = videoEl.duration || 0;
      if (!dur) return;
      const t = pct * dur;
      const trackRect = progressTrack.getBoundingClientRect();
      const relX = clientX - trackRect.left;
      const halfW = 80;
      const clamped = Math.max(halfW, Math.min(trackRect.width - halfW, relX));
      framePreview.style.left = `${clamped}px`;
      frameTimeLbl.textContent = fmt(t);
      framePreview.classList.add('show');
      seekScrubTo(t);
    }

    const onWrapEnter = () => {
      ensureScrub();
      if (canScrub) framePreview.classList.add('show');
    };
    const onWrapLeave = () => {
      if (!isDragging) framePreview.classList.remove('show');
    };
    const onWrapMove = (e: MouseEvent) => {
      const dur = videoEl.duration || 0;
      if (!dur) return;
      const pct = getPct(e.clientX);
      if (isDragging) {
        progressFill.classList.add('no-transition');
        progressFill.style.width = `${pct * 100}%`;
        videoEl.currentTime = pct * dur;
      }
      showFrameAt(pct, e.clientX);
    };
    const onWrapDown = (e: MouseEvent) => {
      e.stopPropagation();
      const dur = videoEl.duration || 0;
      if (!dur) return;
      isDragging = true;
      progressWrap.classList.add('dragging');
      progressFill.classList.add('no-transition');
      const pct = getPct(e.clientX);
      progressFill.style.width = `${pct * 100}%`;
      videoEl.currentTime = pct * dur;
    };

    progressWrap.addEventListener('mouseenter', onWrapEnter);
    progressWrap.addEventListener('mouseleave', onWrapLeave);
    progressWrap.addEventListener('mousemove', onWrapMove);
    progressWrap.addEventListener('mousedown', onWrapDown);

    const onWinUp = () => {
      if (isDragging) {
        isDragging = false;
        progressWrap.classList.remove('dragging');
        framePreview.classList.remove('show');
      }
    };
    const onWinMove = (e: MouseEvent) => {
      const dur = videoEl.duration || 0;
      if (isDragging && dur) {
        const pct = getPct(e.clientX);
        progressFill.style.width = `${pct * 100}%`;
        videoEl.currentTime = pct * dur;
        showFrameAt(pct, e.clientX);
      }
    };
    window.addEventListener('mouseup', onWinUp);
    window.addEventListener('mousemove', onWinMove);

    const onWrapTouchStart = (e: TouchEvent) => {
      e.stopPropagation();
      const dur = videoEl.duration || 0;
      if (!dur) return;
      isDragging = true;
      progressWrap.classList.add('dragging');
      progressFill.classList.add('no-transition');
      const pct = getPct(e.touches[0].clientX);
      progressFill.style.width = `${pct * 100}%`;
      videoEl.currentTime = pct * dur;
    };
    const onWrapTouchMove = (e: TouchEvent) => {
      const dur = videoEl.duration || 0;
      if (!isDragging || !dur) return;
      const pct = getPct(e.touches[0].clientX);
      progressFill.style.width = `${pct * 100}%`;
      videoEl.currentTime = pct * dur;
    };
    const onWrapTouchEnd = (e: TouchEvent) => {
      // Kill the synthetic mouse events so the emulated mousedown cannot
      // re-enter drag mode and leave the slider stuck after you lift off.
      e.preventDefault();
      isDragging = false;
      progressWrap.classList.remove('dragging');
      framePreview.classList.remove('show');
    };
    progressWrap.addEventListener('touchstart', onWrapTouchStart, {
      passive: true,
    });
    progressWrap.addEventListener('touchmove', onWrapTouchMove, {
      passive: true,
    });
    progressWrap.addEventListener('touchend', onWrapTouchEnd);

    /* ---- Click / tap gestures on the video ----------------------------- */

    const onCatchClick = () => {
      if (Date.now() - lastTouchEnd < 600) return; // emulated from a tap
      if (didHold) {
        didHold = false;
        return;
      }
      togglePlay();
    };
    const onCatchMouseDown = (e: MouseEvent) => {
      if (Date.now() - lastTouchEnd < 600) return;
      e.stopPropagation();
      didHold = false;
      holdTimer = window.setTimeout(() => {
        didHold = true;
        isHolding = true;
        videoEl.playbackRate = 2;
        holdBadge.classList.add('show');
      }, 400);
    };
    clickCatch.addEventListener('click', onCatchClick);
    clickCatch.addEventListener('mousedown', onCatchMouseDown);

    const onWinMouseUp = () => {
      if (holdTimer) {
        window.clearTimeout(holdTimer);
        holdTimer = null;
      }
      if (isHolding) {
        isHolding = false;
        videoEl.playbackRate = currentSpeed;
        holdBadge.classList.remove('show');
      }
    };
    window.addEventListener('mouseup', onWinMouseUp);

    const DOUBLE_TAP_MS = 300;
    const MOVE_TOL = 12;
    let lastTapT = 0;
    let lastTapSide = '';
    let tStartX = 0;
    let tStartY = 0;
    let tMoved = false;

    function showCtrls() {
      controls.classList.add('reveal');
      pw.classList.remove('hide-cursor');
      window.clearTimeout(controlsTimeout);
      controlsTimeout = window.setTimeout(() => {
        controls.classList.remove('reveal');
        pw.classList.add('hide-cursor');
      }, 2600);
    }

    function seekSide(dir: 'back' | 'fwd') {
      const dur = videoEl.duration || 0;
      if (!dur) return;
      seekAndAnimate(videoEl.currentTime + (dir === 'back' ? -10 : 10));
      flashSeek(dir);
      flashEdge(dir === 'back' ? 'left' : 'right');
      showCtrls();
    }

    function tapSide(clientX: number) {
      const r = clickCatch.getBoundingClientRect();
      const f = r.width ? (clientX - r.left) / r.width : 0.5;
      if (f < 0.35) return 'left';
      if (f > 0.65) return 'right';
      return 'center';
    }

    const onCatchTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      tStartX = t.clientX;
      tStartY = t.clientY;
      tMoved = false;
      didHold = false;
      holdTimer = window.setTimeout(() => {
        didHold = true;
        isHolding = true;
        videoEl.playbackRate = 2;
        holdBadge.classList.add('show');
      }, 400);
    };
    const onCatchTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (
        Math.abs(t.clientX - tStartX) > MOVE_TOL ||
        Math.abs(t.clientY - tStartY) > MOVE_TOL
      ) {
        tMoved = true;
        if (holdTimer) {
          window.clearTimeout(holdTimer);
          holdTimer = null;
        }
      }
    };
    const onCatchTouchEnd = (e: TouchEvent) => {
      // Suppress the emulated mouse/click events that follow a tap — without
      // this every tap toggles play twice and nothing appears to happen.
      e.preventDefault();
      lastTouchEnd = Date.now();
      if (holdTimer) {
        window.clearTimeout(holdTimer);
        holdTimer = null;
      }
      if (isHolding) {
        isHolding = false;
        videoEl.playbackRate = currentSpeed;
        holdBadge.classList.remove('show');
        didHold = false;
        return;
      }
      didHold = false;
      if (tMoved) return;
      const touch = e.changedTouches[0];
      const side = tapSide(touch.clientX);
      const now = Date.now();
      const isDouble =
        now - lastTapT < DOUBLE_TAP_MS && side === lastTapSide && side !== 'center';
      if (isDouble) {
        if (singleTapTimer) {
          window.clearTimeout(singleTapTimer);
          singleTapTimer = null;
        }
        seekSide(side === 'left' ? 'back' : 'fwd');
        lastTapT = now;
        lastTapSide = side;
        return;
      }
      lastTapT = now;
      lastTapSide = side;
      if (side === 'center') {
        if (singleTapTimer) {
          window.clearTimeout(singleTapTimer);
          singleTapTimer = null;
        }
        togglePlay();
      } else {
        if (singleTapTimer) window.clearTimeout(singleTapTimer);
        singleTapTimer = window.setTimeout(() => {
          singleTapTimer = null;
          togglePlay();
        }, DOUBLE_TAP_MS);
      }
    };
    clickCatch.addEventListener('touchstart', onCatchTouchStart, {
      passive: true,
    });
    clickCatch.addEventListener('touchmove', onCatchTouchMove, { passive: true });
    clickCatch.addEventListener('touchend', onCatchTouchEnd);

    /* ---- Buttons -------------------------------------------------------- */

    const onMiniPlay = (e: Event) => {
      e.stopPropagation();
      togglePlay();
    };
    const onMuteToggle = (e: Event) => {
      e.stopPropagation();
      applyMute(!curMuted);
    };
    const onReplay = (e: Event) => {
      e.stopPropagation();
      showReplay(false);
      videoEl.currentTime = 0;
      void videoEl.play().catch(() => {});
      setPaused(false);
    };
    miniPlay.addEventListener('click', onMiniPlay);
    miniMute.addEventListener('click', onMuteToggle);
    muteBtn.addEventListener('click', onMuteToggle);
    replayBtn.addEventListener('click', onReplay);

    function positionSpeedPanel() {
      const btnRect = speedBtn.getBoundingClientRect();
      const ctrlRect = controls.getBoundingClientRect();
      const panelW = speedPanel.offsetWidth || 80;
      const btnCenterX = btnRect.left + btnRect.width / 2 - ctrlRect.left;
      speedPanel.style.right = 'auto';
      speedPanel.style.left = `${btnCenterX - panelW / 2}px`;
    }
    function openSpeed() {
      speedPanel.classList.remove('hidden');
      speedPanel.classList.add('visible');
      positionSpeedPanel();
    }
    function closeSpeed() {
      speedPanel.classList.remove('visible');
      speedPanel.classList.add('hidden');
    }
    const onSpeedBtn = (e: Event) => {
      e.stopPropagation();
      if (speedPanel.classList.contains('visible')) closeSpeed();
      else openSpeed();
    };
    speedBtn.addEventListener('click', onSpeedBtn);

    function applySpeed(s: number) {
      currentSpeed = s;
      videoEl.playbackRate = s;
      speedBtn.textContent = `${s}\u00d7`;
      $$('.speed-opt').forEach((o) =>
        o.classList.toggle('active', parseFloat(o.dataset.speed as string) === s),
      );
      showToast(`Speed ${s}\u00d7`);
    }
    const speedOptHandlers: Array<[HTMLElement, (e: Event) => void]> = [];
    $$('.speed-opt').forEach((opt) => {
      const h = (e: Event) => {
        e.stopPropagation();
        applySpeed(parseFloat(opt.dataset.speed as string));
        closeSpeed();
      };
      opt.addEventListener('click', h);
      speedOptHandlers.push([opt, h]);
    });
    const onDocClick = () => closeSpeed();
    document.addEventListener('click', onDocClick);

    /* ---- Fullscreen ------------------------------------------------------ */

    /* The vendor-prefixed fullscreen APIs need care under `strict`.
       Writing `(a || b || c).call(el)` — as the original JavaScript did —
       builds a union of function types whose signatures differ, and
       strictBindCallApply (implied by `strict: true`) then rejects the
       `.call`. Picking one function into a single typed variable first
       sidesteps that entirely. */
    type FullscreenElement = HTMLElement & {
      webkitRequestFullscreen?: () => unknown;
      msRequestFullscreen?: () => unknown;
    };
    type FullscreenDocument = Document & {
      webkitExitFullscreen?: () => unknown;
      msExitFullscreen?: () => unknown;
      webkitFullscreenElement?: Element | null;
      msFullscreenElement?: Element | null;
    };

    function requestFS(el: FullscreenElement) {
      const fn: (() => unknown) | undefined =
        el.requestFullscreen ?? el.webkitRequestFullscreen ?? el.msRequestFullscreen;
      try {
        void fn?.call(el);
      } catch {
        /* denied by the browser — stay inline */
      }
    }
    function exitFS() {
      const d = document as FullscreenDocument;
      const fn: (() => unknown) | undefined =
        d.exitFullscreen ?? d.webkitExitFullscreen ?? d.msExitFullscreen;
      try {
        void fn?.call(d);
      } catch {
        /* nothing to exit */
      }
    }
    function isFS() {
      const d = document as FullscreenDocument;
      return !!(d.fullscreenElement || d.webkitFullscreenElement || d.msFullscreenElement);
    }
    function toggleFullscreen() {
      closeSpeed();
      if (!isFS()) {
        pw.classList.add('going-fullscreen');
        window.setTimeout(() => {
          requestFS(pw as FullscreenElement);
          window.setTimeout(() => pw.classList.remove('going-fullscreen'), 600);
        }, 80);
      } else {
        exitFS();
      }
    }
    const onFsBtn = (e: Event) => {
      e.stopPropagation();
      toggleFullscreen();
    };
    fullscreenBtn.addEventListener('click', onFsBtn);

    const fsEvents = ['fullscreenchange', 'webkitfullscreenchange', 'MSFullscreenChange'];
    const onFsChange = () => {
      closeSpeed();
      fsIcon.innerHTML = isFS()
        ? '<path d="M4.5 1H1.5v3M9.5 1h3v3M12 8.5v3h-3M4.5 12H1.5v-3" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/>'
        : '<path d="M1 4.5V1.5h3M9 1.5h3v3M12 8.5v3h-3M4 11.5H1v-3" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/>';
    };
    fsEvents.forEach((evt) => document.addEventListener(evt, onFsChange));

    /* ---- Reveal, keyboard, autoplay -------------------------------------- */

    const onPwMove = () => showCtrls();
    const onPwLeave = () => {
      window.clearTimeout(controlsTimeout);
      controls.classList.remove('reveal');
      pw.classList.remove('hide-cursor');
    };
    const onPwTouchStart = (e: TouchEvent) => {
      if (e.target === clickCatch || e.target === pw) showCtrls();
    };
    pw.addEventListener('mousemove', onPwMove);
    pw.addEventListener('mouseleave', onPwLeave);
    pw.addEventListener('touchstart', onPwTouchStart, { passive: true });

    // Bound to the player, not the document: a global space-bar handler would
    // hijack the key while the form below the video has focus.
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          seekSide('back');
          break;
        case 'ArrowRight':
          seekSide('fwd');
          break;
        case 'ArrowUp':
          e.preventDefault();
          curVol = Math.min(1, curVol + 0.05);
          videoEl.volume = curVol;
          showToast(`${Math.round(curVol * 100)}%`);
          break;
        case 'ArrowDown':
          e.preventDefault();
          curVol = Math.max(0, curVol - 0.05);
          videoEl.volume = curVol;
          showToast(`${Math.round(curVol * 100)}%`);
          break;
        case 'm':
        case 'M':
          applyMute(!curMuted);
          showToast(curMuted ? 'Muted' : 'Unmuted');
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case '>':
        case '.': {
          const i = speeds.indexOf(currentSpeed);
          if (i < speeds.length - 1) applySpeed(speeds[i + 1]);
          break;
        }
        case '<':
        case ',': {
          const i = speeds.indexOf(currentSpeed);
          if (i > 0) applySpeed(speeds[i - 1]);
          break;
        }
      }
    };
    pw.addEventListener('keydown', onKeyDown as EventListener);

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0].isIntersecting;
        if (autoplay) {
          if (inView) autoStart();
          else {
            videoEl.pause();
            setPaused(true);
          }
        }
      },
      { threshold: 0.25 },
    );
    io.observe(pw);

    replayIcon.innerHTML = REPLAY;
    updatePlayIcons();
    updateMuteIcons();
    videoEl.load();
    if (autoplay && inView) autoStart();

    return () => {
      window.clearTimeout(controlsTimeout);
      window.clearTimeout(toastTimer);
      window.clearTimeout(seekTimer);
      window.clearTimeout(ppTimer);
      if (holdTimer) window.clearTimeout(holdTimer);
      if (singleTapTimer) window.clearTimeout(singleTapTimer);
      io.disconnect();

      videoEl.removeEventListener('timeupdate', onTime);
      videoEl.removeEventListener('loadedmetadata', onMeta);
      videoEl.removeEventListener('play', onPlay);
      videoEl.removeEventListener('pause', onPause);
      videoEl.removeEventListener('ended', onEnded);

      progressWrap.removeEventListener('mouseenter', onWrapEnter);
      progressWrap.removeEventListener('mouseleave', onWrapLeave);
      progressWrap.removeEventListener('mousemove', onWrapMove);
      progressWrap.removeEventListener('mousedown', onWrapDown);
      progressWrap.removeEventListener('touchstart', onWrapTouchStart);
      progressWrap.removeEventListener('touchmove', onWrapTouchMove);
      progressWrap.removeEventListener('touchend', onWrapTouchEnd);

      clickCatch.removeEventListener('click', onCatchClick);
      clickCatch.removeEventListener('mousedown', onCatchMouseDown);
      clickCatch.removeEventListener('touchstart', onCatchTouchStart);
      clickCatch.removeEventListener('touchmove', onCatchTouchMove);
      clickCatch.removeEventListener('touchend', onCatchTouchEnd);

      miniPlay.removeEventListener('click', onMiniPlay);
      miniMute.removeEventListener('click', onMuteToggle);
      muteBtn.removeEventListener('click', onMuteToggle);
      replayBtn.removeEventListener('click', onReplay);
      speedBtn.removeEventListener('click', onSpeedBtn);
      fullscreenBtn.removeEventListener('click', onFsBtn);
      speedOptHandlers.forEach(([el, h]) => el.removeEventListener('click', h));

      pw.removeEventListener('mousemove', onPwMove);
      pw.removeEventListener('mouseleave', onPwLeave);
      pw.removeEventListener('touchstart', onPwTouchStart);
      pw.removeEventListener('keydown', onKeyDown as EventListener);

      window.removeEventListener('mouseup', onWinUp);
      window.removeEventListener('mousemove', onWinMove);
      window.removeEventListener('mouseup', onWinMouseUp);
      document.removeEventListener('click', onDocClick);
      fsEvents.forEach((evt) => document.removeEventListener(evt, onFsChange));

      if (scrubVid) {
        scrubVid.removeEventListener('seeked', onScrubSeeked);
        try {
          scrubVid.removeAttribute('src');
          scrubVid.load();
        } catch {
          /* nothing to clean up */
        }
        scrubVid = null;
      }
      try {
        videoEl.pause();
      } catch {
        /* already torn down */
      }
    };
  }, [src, poster, autoplay, autoMute, loop]);

  const rootStyle = {
    width: '100%',
    '--radius': `${cornerRadius}px`,
    '--progress-color': progressColor,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={`framer-vp${minimal ? ' minimal' : ''}`}
      style={rootStyle}
    >
      <style>{CSS}</style>
      <div className="app">
        <div className="player-wrap" tabIndex={0} aria-label="Video player">
          <div className="media">
            <video className="video-el" playsInline preload="metadata" />
          </div>
          <div className="click-catch" />

          <div className="edge-flash edge-left" />
          <div className="edge-flash edge-right" />

          <div className="playpause-flash">
            <svg className="pp-icon" width="26" height="26" viewBox="0 0 24 24" fill="currentColor" />
          </div>

          <button className="replay-btn" title="Replay" type="button">
            <svg width="30" height="30" viewBox="0 0 24 24" />
          </button>

          <div className="hold-badge">2&#215; Speed</div>

          <div className="seek-indicator">
            <svg
              className="seek-icon"
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              stroke="white"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="10,4 6,8 10,12" />
            </svg>
            <span className="seek-label">&#8722;10s</span>
          </div>

          <div className="speed-panel hidden">
            {['0.5', '0.75', '1', '1.25', '1.5', '1.75', '2'].map((s) => (
              <div
                key={s}
                className={`speed-opt${s === '1' ? ' active' : ''}`}
                data-speed={s}
              >
                {s}&#215;
              </div>
            ))}
          </div>

          <div className="mini-controls">
            <button className="mini-btn mini-play" title="Play / Pause" type="button">
              <svg width="20" height="20" viewBox="0 0 24 24" />
            </button>
            <button className="mini-btn mini-mute" title="Mute" type="button">
              <svg width="20" height="20" viewBox="0 0 24 24" />
            </button>
          </div>

          <div className="controls">
            <div className="progress-wrap">
              <div className="progress-track">
                <div className="progress-fill">
                  <div className="progress-thumb" />
                </div>
              </div>
              <div className="frame-preview">
                <div className="frame-canvas-wrap">
                  <canvas className="frame-canvas" />
                </div>
                <span className="frame-time-label" />
              </div>
            </div>
            <div className="ctrl-row">
              <span className="time-display">0:00 / 0:00</span>
              <button className="ctrl-btn mute-btn" title="Mute (M)" type="button">
                <svg width="17" height="17" viewBox="0 0 24 24" />
              </button>
              <button className="ctrl-btn speed-btn" title="Playback speed" type="button">
                1&#215;
              </button>
              <button className="ctrl-btn fullscreen-btn" title="Fullscreen (F)" type="button">
                <svg
                  className="fs-icon"
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                >
                  <path d="M1 4.5V1.5h3M9 1.5h3v3M12 8.5v3h-3M4 11.5H1v-3" />
                </svg>
              </button>
            </div>
          </div>

          <div className="toast" />
        </div>
      </div>
    </div>
  );
}

/* Font family inherits from the page rather than pulling Inter from Google —
   the site already loads its own typefaces. */
const CSS = `
.framer-vp {
  --spring: cubic-bezier(0.34,1.56,0.64,1);
  --ease-out: cubic-bezier(0.16,1,0.3,1);
  background: transparent;
  font-family: inherit;
  user-select: none;
  -webkit-font-smoothing: antialiased;
}
.framer-vp *, .framer-vp *::before, .framer-vp *::after {
  box-sizing: border-box; margin: 0; padding: 0;
  -webkit-tap-highlight-color: transparent;
}
.framer-vp svg { display: block; }

.framer-vp .app { width: 100%; display: flex; justify-content: center; }

.framer-vp .player-wrap {
  width: 100%; position: relative;
  border-radius: var(--radius, 12px); overflow: hidden;
  background: transparent; transform: translateZ(0);
  transition: border-radius 0.45s var(--ease-out);
}
.framer-vp .player-wrap:focus-visible { outline: 3px solid #FFCD00; outline-offset: 3px; }
.framer-vp .player-wrap.going-fullscreen { border-radius: 0; }
.framer-vp .player-wrap:fullscreen {
  width:100vw;height:100vh;max-width:none;border-radius:0;
  display:flex;align-items:center;justify-content:center;background:#000;
}

.framer-vp .media {
  position: relative; width: 100%;
  aspect-ratio: var(--ar, 16 / 9);
  background: #000; overflow: hidden; border-radius: inherit;
}
.framer-vp .media .video-el {
  position: absolute; inset: 0; width: 100%; height: 100%;
  border: 0; background: #000; object-fit: contain;
}
.framer-vp .player-wrap:fullscreen .media { width: 100vw; height: 100vh; aspect-ratio: auto; border-radius: 0; }

.framer-vp .click-catch { position: absolute; inset: 0; z-index: 5; cursor: pointer; touch-action: manipulation; }

.framer-vp .edge-flash { position: absolute; top: 0; bottom: 0; width: 5.5%; pointer-events: none; z-index: 18; opacity: 0; }
.framer-vp .edge-left { left: 0; }
.framer-vp .edge-right { right: 0; }
.framer-vp .edge-flash::before {
  content: ''; position: absolute; inset: 0;
  backdrop-filter: blur(18px) saturate(2.2) brightness(1.05) contrast(1.1);
  -webkit-backdrop-filter: blur(18px) saturate(2.2) brightness(1.05) contrast(1.1);
}
.framer-vp .edge-left::before {
  mask-image: linear-gradient(to right, black 0%, black 25%, rgba(0,0,0,0.5) 60%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, black 0%, black 25%, rgba(0,0,0,0.5) 60%, transparent 100%);
}
.framer-vp .edge-right::before {
  mask-image: linear-gradient(to left, black 0%, black 25%, rgba(0,0,0,0.5) 60%, transparent 100%);
  -webkit-mask-image: linear-gradient(to left, black 0%, black 25%, rgba(0,0,0,0.5) 60%, transparent 100%);
}
.framer-vp .edge-flash.flash-in { animation: vpEdge 0.6s var(--ease-out) forwards; }
@keyframes vpEdge { 0% { opacity: 0; } 8% { opacity: 1; } 100% { opacity: 0; } }

.framer-vp .playpause-flash {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  pointer-events: none; z-index: 26; opacity: 0;
  width: 72px; height: 72px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  background: rgba(255,255,255,0.15);
}
.framer-vp .playpause-flash svg { color: #fff; }
.framer-vp .playpause-flash.show { animation: vpPp 1.1s var(--ease-out) forwards; }
@keyframes vpPp {
  0% { opacity: 0; transform: translate(-50%,-50%) scale(0.8); }
  12% { opacity: 1; transform: translate(-50%,-50%) scale(1); }
  72% { opacity: 1; transform: translate(-50%,-50%) scale(1); }
  100% { opacity: 0; transform: translate(-50%,-50%) scale(1); }
}

.framer-vp .replay-btn {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 72px; height: 72px; border-radius: 50%;
  display: none; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 0; color: #fff; cursor: pointer; z-index: 27;
  transition: background 0.12s, transform 0.1s var(--spring);
}
.framer-vp .replay-btn.show { display: flex; }
.framer-vp .replay-btn:hover { background: rgba(255,255,255,0.24); }
.framer-vp .replay-btn:active { transform: translate(-50%, -50%) scale(0.9); }

.framer-vp .controls {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 56px 16px 16px;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
  opacity: 0; pointer-events: none; transform: translateY(10px);
  transition: opacity 0.25s var(--ease-out), transform 0.25s var(--ease-out);
  z-index: 15;
}
.framer-vp .controls.reveal { opacity: 1; transform: none; }
.framer-vp .controls.reveal .progress-wrap,
.framer-vp .controls.reveal .ctrl-row { pointer-events: auto; }
.framer-vp.minimal .controls { display: none !important; }
.framer-vp .player-wrap.hide-cursor,
.framer-vp .player-wrap.hide-cursor * { cursor: none !important; }

.framer-vp .mini-controls {
  position: absolute; bottom: 14px; left: 14px;
  display: none; gap: 8px; z-index: 16;
}
.framer-vp.minimal .mini-controls { display: flex; }
.framer-vp .mini-btn {
  width: 38px; height: 38px; border-radius: 50%;
  background: rgba(255,255,255,0.16);
  backdrop-filter: blur(20px) saturate(1.5); -webkit-backdrop-filter: blur(20px) saturate(1.5);
  border: 0; color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.12s, transform 0.08s;
}
.framer-vp .mini-btn:hover { background: rgba(255,255,255,0.26); }
.framer-vp .mini-btn:active { transform: scale(0.92); }

.framer-vp .seek-indicator {
  position: absolute; top: 50%; transform: translateY(-50%);
  display: flex; align-items: center; gap: 9px;
  background: rgba(255,255,255,0.13);
  backdrop-filter: blur(20px) saturate(1.5); -webkit-backdrop-filter: blur(20px) saturate(1.5);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 14px; padding: 10px 22px;
  color: #fff; font-size: 13px; font-weight: 500;
  pointer-events: none; z-index: 25; opacity: 0; transition: opacity 0.15s;
}
.framer-vp .seek-indicator.show { opacity: 1; }

.framer-vp .progress-wrap {
  width: 100%; height: 48px; display: flex; align-items: center;
  cursor: pointer; margin-bottom: 10px; position: relative; touch-action: none;
}
.framer-vp .progress-track {
  width: 100%; height: 5px; border-radius: 99px;
  background: rgba(255,255,255,0.18);
  backdrop-filter: blur(12px) saturate(1.5); -webkit-backdrop-filter: blur(12px) saturate(1.5);
  border: 1px solid rgba(255,255,255,0.14);
  position: relative; overflow: visible;
  transition: height 0.2s var(--spring);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.08);
}
.framer-vp .progress-wrap:hover .progress-track,
.framer-vp .progress-wrap.dragging .progress-track { height: 7px; }
.framer-vp .progress-fill {
  height: 100%; background: var(--progress-color, #E8A317);
  border-radius: 99px; pointer-events: none; position: relative;
}
.framer-vp .progress-fill.no-transition { transition: none; }
.framer-vp .progress-thumb {
  position: absolute; right: -10px; top: 50%; transform: translateY(-50%) scale(0);
  width: 20px; height: 12px; border-radius: 99px; background: #fff; opacity: 0;
  transition: opacity 0.18s, width 0.32s var(--spring), height 0.32s var(--spring), transform 0.32s var(--spring), right 0.32s var(--spring);
  pointer-events: none; box-shadow: 0 1px 6px rgba(0,0,0,0.4);
}
.framer-vp .progress-wrap:hover .progress-thumb,
.framer-vp .progress-wrap.dragging .progress-thumb { opacity: 1; transform: translateY(-50%) scale(1); width: 28px; height: 14px; right: -14px; }
.framer-vp .progress-wrap.dragging .progress-thumb { animation: vpPill 0.35s var(--spring) infinite alternate; }
@keyframes vpPill { 0% { width: 28px; height: 14px; } 100% { width: 34px; height: 10px; } }

.framer-vp .frame-preview {
  position: absolute; bottom: 60px; left: 0; transform: translateX(-50%);
  opacity: 0; pointer-events: none; transition: opacity 0.15s; z-index: 30;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
}
.framer-vp .frame-preview.show { opacity: 1; }
.framer-vp .frame-canvas-wrap {
  width: 160px; height: 90px; border-radius: 9px; overflow: hidden;
  border: 1px solid rgba(255,255,255,0.3); box-shadow: 0 8px 28px rgba(0,0,0,0.6); background: #111;
}
.framer-vp .frame-canvas { width: 100%; height: 100%; display: block; }
.framer-vp .frame-time-label {
  font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.85);
  white-space: nowrap; letter-spacing: 0.04em; background: rgba(0,0,0,0.4);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  padding: 3px 10px; border-radius: 99px; border: 1px solid rgba(255,255,255,0.14);
}

.framer-vp .ctrl-row { display: flex; align-items: center; gap: 5px; }
.framer-vp .ctrl-btn {
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(16px) saturate(1.4); -webkit-backdrop-filter: blur(16px) saturate(1.4);
  border: 1px solid rgba(255,255,255,0.18); color: rgba(255,255,255,0.92);
  border-radius: 8px; width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.12s, transform 0.08s; flex-shrink: 0;
}
.framer-vp .ctrl-btn:hover { background: rgba(255,255,255,0.22); border-color: rgba(255,255,255,0.3); }
.framer-vp .ctrl-btn:active { transform: scale(0.92); }
.framer-vp .time-display {
  font-size: 12px; font-weight: 400; color: rgba(255,255,255,0.7);
  letter-spacing: 0.02em; flex: 1; padding-left: 6px; font-variant-numeric: tabular-nums;
}

.framer-vp .speed-btn { font-size: 10px; font-weight: 500; letter-spacing: 0.03em; min-width: 38px; }
.framer-vp .speed-panel {
  position: absolute; bottom: 64px;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(28px) saturate(1.8); -webkit-backdrop-filter: blur(28px) saturate(1.8);
  border: 1px solid rgba(0,0,0,0.1); border-radius: 12px; padding: 5px; z-index: 30;
  box-shadow: 0 10px 36px rgba(0,0,0,0.18);
  min-width: 80px; transform-origin: bottom center; pointer-events: auto;
}
.framer-vp .speed-panel.hidden { opacity: 0; pointer-events: none; transform: scaleY(0.5) translateY(8px); transition: opacity 0.08s ease, transform 0.1s ease; }
.framer-vp .speed-panel.visible { opacity: 1; pointer-events: auto; transform: scaleY(1) translateY(0); transition: opacity 0.18s ease, transform 0.22s cubic-bezier(0.22,1,0.36,1); }
.framer-vp .speed-opt {
  font-size: 12px; font-weight: 400; padding: 8px 14px; border-radius: 7px; cursor: pointer;
  color: rgba(0,0,0,0.65); text-align: center; transition: background 0.1s, color 0.1s; font-variant-numeric: tabular-nums;
}
.framer-vp .speed-opt:hover { background: rgba(0,0,0,0.06); color: #000; }
.framer-vp .speed-opt.active { color: #000; font-weight: 500; background: rgba(0,0,0,0.07); }

.framer-vp .toast {
  position: absolute; top: 14px; left: 50%; transform: translateX(-50%) translateY(-50px);
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(0,0,0,0.08); border-radius: 8px;
  padding: 7px 16px; font-size: 11.5px; font-weight: 500; color: #1a1a1a;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  transition: transform 0.28s var(--spring);
  z-index: 40; white-space: nowrap; pointer-events: none;
}
.framer-vp .toast.show { transform: translateX(-50%) translateY(0); }

.framer-vp .hold-badge {
  position: absolute; top: 14px; left: 50%; transform: translateX(-50%) translateY(-40px);
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(20px) saturate(1.6); -webkit-backdrop-filter: blur(20px) saturate(1.6);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 99px; padding: 5px 14px;
  color: rgba(255,255,255,0.95); font-size: 11px; font-weight: 500; letter-spacing: 0.04em;
  pointer-events: none; z-index: 28; opacity: 0; transition: opacity 0.2s, transform 0.28s var(--spring);
}
.framer-vp .hold-badge.show { opacity: 1; transform: translateX(-50%) translateY(0); }

@media (prefers-reduced-motion: reduce) {
  .framer-vp *, .framer-vp *::before, .framer-vp *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
`;
