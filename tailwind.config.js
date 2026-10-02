/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#070b10',
        surface: '#0d141d',
        line: '#1a2432',
        txt: '#e8edf2',
        dim: '#8b98a8',
        accent: '#22d3ee',
        'accent-dim': '#0e7490',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      gridTemplateColumns: {
        shell: '1px 1fr 1px',
      },
    },
  },
  plugins: [],
}
