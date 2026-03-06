/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#edfdf4',
          100: '#d3f9e5',
          200: '#aaf0cc',
          300: '#73e2ad',
          400: '#39cc88',
          500: '#16b06a',
          600: '#0a9057',
          700: '#087248',
          800: '#095a3a',
          900: '#094b31',
          950: '#042a1c',
        },
        dark: {
          950: '#060d0a',
          900: '#0b1610',
          800: '#112118',
          700: '#1a3326',
          600: '#244a37',
        }
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'blink':      'blink 1s step-end infinite',
        'slide-in':   'slideIn 0.3s ease forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        blink:     { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
        slideIn:   { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
        glowPulse: { '0%,100%': { boxShadow: '0 0 20px rgba(22,176,106,0.2)' }, '50%': { boxShadow: '0 0 40px rgba(22,176,106,0.5)' } },
      },
      typography: {
        DEFAULT: { css: { maxWidth: 'none' } }
      }
    }
  },
  plugins: []
}
