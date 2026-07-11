/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#0E0E10",
        brass: "#C8A16A",
        cream: "#EDE7DD",
        muted: "#7A756C",
        "charcoal-warm": "#16130F",
        "charcoal-raised": "#1C1915",
      },
      fontFamily: {
        display: ['"El Messiri"', "serif"],
        sans: ['"IBM Plex Sans Arabic"', "Tahoma", "sans-serif"],
      },
      boxShadow: {
        phone:
          "0 28px 60px -18px rgba(0, 0, 0, 0.75), 0 12px 24px -12px rgba(0, 0, 0, 0.55)",
        "brass-glow":
          "0 0 0 1px rgba(200, 161, 106, 0.55), 0 0 18px rgba(200, 161, 106, 0.22)",
        card: "0 8px 20px -12px rgba(0, 0, 0, 0.55)",
      },
    },
  },
  plugins: [],
}
