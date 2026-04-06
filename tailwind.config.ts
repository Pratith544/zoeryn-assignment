import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
        body: ['var(--font-manrope)', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        border: 'var(--border)',
        primary: 'var(--primary)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        income: 'var(--accent-income)',
        expense: 'var(--accent-expense)',
        amber: 'var(--accent-amber)',
        analyst: 'var(--accent-analyst)',
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
        md: '2px',
        lg: '2px',
      },
      keyframes: {
        'fade-in': {
          'from': { opacity: '0', transform: 'translateY(8px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-y-enter': {
          'from': { scaleY: '0' },
          'to': { scaleY: '1' },
        },
        'count-up': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'modal-in': {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        'overlay-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'slide-in-from-right': {
          'from': { opacity: '0', transform: 'translateX(100%)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease',
        'scale-y-enter': 'scale-y-enter 200ms ease',
        'count-up': 'count-up 800ms ease',
        'shimmer': 'shimmer 2s infinite',
        'modal-in': 'modal-in 200ms ease',
        'overlay-in': 'overlay-in 150ms ease',
        'slide-in-from-right': 'slide-in-from-right 200ms ease',
      },
    },
  },
  plugins: [],
}
export default config
