/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary - Stitch gold (canonical)
        primary: "#d4a954",
        "primary-light": "#e8c87e",
        "primary-dark": "#b8923f",
        "primary-glow": "rgba(212, 169, 84, 0.6)",
        "text-gold": "#FFEBB8",

        // Backgrounds
        "background-dark": "#0A0E1A",
        "surface-dark": "#162235",
        "surface-highlight": "#1E2C42",
        "input-bg": "#1F2937",

        // Text
        "text-primary": "#F0F4F8",
        "text-secondary": "#8A9BB5",
        "dot-empty": "#2E3A4D",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        full: "9999px",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "wave": "wave 1.5s ease-in-out infinite",
        "fade-up": "fadeUp 0.8s ease-out forwards",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(212, 169, 84, 0.5)" },
          "50%": { boxShadow: "0 0 15px rgba(212, 169, 84, 0.9)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        wave: {
          "0%, 100%": { opacity: "0.6", height: "30%" },
          "50%": { opacity: "1", height: "70%" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
