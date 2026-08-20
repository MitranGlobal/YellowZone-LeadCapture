'use client';

import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

/**
 * One controller for every scroll reveal on the page. Any element marked
 * with data-reveal rises into place as its section is reached; elements
 * that share a parent marked data-reveal-group stagger together, which is
 * what makes a rubric of five domains read as one list arriving rather
 * than five unrelated fades.
 *
 * Content is visible by default. The hiding class is only applied once
 * this component has mounted, so a JS failure or a reduced-motion setting
 * still leaves a fully readable page.
 */
export default function ScrollReveals() {
  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const root = document.documentElement;
    root.classList.add('reveal-ready');

    const ctx = gsap.context(() => {
      // Grouped items stagger; standalone items animate on their own.
      gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>('[data-reveal]');
        if (!items.length) return;
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.09,
          scrollTrigger: { trigger: group, start: 'top 84%', once: true },
        });
      });

      gsap.utils
        .toArray<HTMLElement>('[data-reveal]')
        .filter((el) => !el.closest('[data-reveal-group]'))
        .forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      ctx.revert();
      root.classList.remove('reveal-ready');
    };
  }, []);

  return null;
}
