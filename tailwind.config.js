/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // System fonts only: every target platform ships Sinhala and Tamil faces, so we avoid
        // downloading web fonts on metered mobile data. Browsers fall back per glyph, so the
        // order is: Latin UI font → Sinhala/Tamil faces (Android/Linux, Windows, Apple).
        sans: [
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          '"Noto Sans"',
          '"Noto Sans Sinhala"',
          '"Noto Sans Tamil"',
          '"Nirmala UI"',
          '"Iskoola Pota"',
          'Latha',
          '"Sinhala Sangam MN"',
          '"Tamil Sangam MN"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
        ],
      },
      keyframes: {
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(-0.5rem)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'sheet-in': {
          from: { opacity: '0', transform: 'translateY(1.5rem)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'toast-in': 'toast-in 180ms ease-out',
        'sheet-in': 'sheet-in 220ms ease-out',
      },
    },
  },
  plugins: [],
}
