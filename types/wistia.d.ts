import type React from 'react';

/**
 * <wistia-player> is a custom element, so React needs to be told it exists.
 * Declared on react's own JSX namespace, which is where React 19 moved it.
 */
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'wistia-player': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        'media-id'?: string;
        aspect?: string;
      };
    }
  }
}
