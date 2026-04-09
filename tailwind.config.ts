import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sk: {
          green: '#2D6A4F',
          'green-dark': '#1B4332',
          'green-light': '#40916C',
          'green-soft': '#D8F3DC',
          navy: '#0A1628',
          'navy-alt': '#0F1F35',
          cream: '#FAF8F3',
          'cream-warm': '#F5F0E6',
          'cream-deep': '#EDE6D3',
          gold: '#C9A961',
          'gold-deep': '#B08D3F',
          'gold-soft': '#F4EBD0',
          brown: '#6B4423',
          stone: '#8B8680',
          'stone-light': '#B8B3AB',
          shadow: '#3A3A3A',
          'border-light': '#E8E2D5',
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
