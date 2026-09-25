/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#006b2c",
        "primary-container": "#00873a",
        "on-primary": "#ffffff",
        "on-primary-container": "#f7fff2",
        "primary-fixed": "#7ffc97",
        "primary-fixed-dim": "#62df7d",
        "on-primary-fixed": "#002109",
        "on-primary-fixed-variant": "#005320",
        
        "secondary": "#6d5e00",
        "secondary-container": "#fcdf46",
        "secondary-fixed": "#ffe24c",
        "secondary-fixed-dim": "#e2c62d",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#726200",
        "on-secondary-fixed": "#211b00",
        "on-secondary-fixed-variant": "#524600",
        
        "tertiary": "#bb0112",
        "tertiary-container": "#e02928",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#fffbff",
        "tertiary-fixed": "#ffdad6",
        "tertiary-fixed-dim": "#ffb4ab",
        "on-tertiary-fixed": "#410002",
        
        "surface": "#FAF8F2",
        "surface-bright": "#fff8f6",
        "surface-dim": "#ffd0bb",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#fff1eb",
        "surface-container": "#ffeae1",
        "surface-container-high": "#ffe2d6",
        "surface-container-highest": "#ffdbcc",
        
        "on-surface": "#351000",
        "on-surface-variant": "#3e4a3d",
        "outline": "#6e7b6c",
        "outline-variant": "#bdcaba",
        "inverse-surface": "#561f00",
        "inverse-on-surface": "#ffede6",
        
        // Farm pasture & wood additions
        "timber": {
          50: "#fdf8f4",
          100: "#f8eee3",
          200: "#f0d9c4",
          300: "#e4bd9d",
          600: "#b56930",
          700: "#92400e",
          800: "#78350f",
          900: "#451a03",
        },
        "pasture": {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
        "straw": {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(53, 16, 0, 0.06)',
        'card': '0 6px 18px -4px rgba(53, 16, 0, 0.08), 0 2px 6px -1px rgba(0, 107, 44, 0.04)',
        'plaque': '0 10px 25px -5px rgba(69, 26, 3, 0.12), 0 8px 10px -6px rgba(69, 26, 3, 0.08)',
        'button-green': '0 4px 14px rgba(0, 135, 58, 0.3)',
        'button-yellow': '0 4px 14px rgba(109, 94, 0, 0.25)',
        'button-red': '0 8px 20px rgba(187, 1, 18, 0.35)',
      }
    },
  },
  plugins: [],
}
