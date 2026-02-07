import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#05090E',
          card: '#0A1117'
        },
        teal: {
          DEFAULT: '#18B7A4',
          dark: '#0FA18E',
          light: '#3FE0C6'
        },
        muted: {
          DEFAULT: '#6C8087',
          light: '#9FB7BF',
          pale: '#E6F1F4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite'
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' }
        }
      }
    }
  },
  plugins: []
} satisfies Config
