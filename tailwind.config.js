/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Light mode */
        'dash-bg-light': '#FDF9F1',
        'card-light':    '#FFFFFF',
        'stat-light':    '#FDFBF7',
        'border-light':  '#E5E7EB',
        'accent-blue':   '#2563EB',
        'accent-red':    '#EF4444',
        'text-main':     '#1F2937',
        'text-muted':    '#6B7280',
        /* Dark mode – deep navy palette from reference */
        'dark-bg':       '#0D1117',
        'dark-card':     '#161D2E',
        'dark-stat':     '#0D1420',
        'dark-border':   '#1E2D45',
        'dark-muted':    '#94A3B8',
        'dark-accent':   '#F97316',   /* orange line/accents in dark */
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
