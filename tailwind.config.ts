import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // Full 0–100 opacity scale so any /NN modifier resolves
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, i) => [String(i), String(i / 100)]),
      ),
      colors: {
        // Palette lifted directly from the Yellow Zone certification seal
        ink: '#0C3A66', // seal navy — primary ground
        'ink-deep': '#082744', // pressed navy, for depth
        'ink-soft': '#1B4E80', // hairlines and rules on navy
        gold: '#E8A317', // seal metal — accent
        'gold-deep': '#B9770E', // engraved gold
        parchment: '#FBF7EE', // seal inner field — light ground
        'parchment-dim': '#F1EADC', // panel fill on parchment
        beacon: '#FFCD00', // MiTran yellow — actions only
        indigo: '#404A7D', // MiTran indigo — secondary headings
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        eyebrow: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.22em' }],
      },
      maxWidth: {
        page: '1180px',
        prose2: '62ch',
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(12,58,102,0.08), 0 18px 40px -28px rgba(12,58,102,0.45)',
        raised: '0 24px 60px -30px rgba(8,39,68,0.75)',
      },
      keyframes: {
        drift: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        drift: 'drift 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
