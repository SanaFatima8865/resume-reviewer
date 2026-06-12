import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        teal: {
          500: '#0EA5A0',
          600: '#0C9490',
          400: '#2EC4BF',
        },
        navy: {
          900: '#0F1729',
          800: '#162035',
          700: '#1E2D47',
          600: '#253859',
        }
      }
    },
  },
  plugins: [],
}
export default config
