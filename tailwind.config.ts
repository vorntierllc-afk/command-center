import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        hri: {
          black: '#0A0A0A',
          white: '#FFFFFF',
          bg: '#FAFAFA',
          border: '#E5E7EB',
          success: '#16A34A',
          warning: '#D97706',
          danger: '#DC2626',
        }
      },
      borderRadius: {
        'full': '9999px',
        '2xl': '1rem',
        'xl': '0.75rem',
      }
    },
  },
  plugins: [],
}
export default config
