import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1a1a1a", // Main background color
          accent: "#666666", // Silver accent color
          light: "#f5f5f5", // Light background
        },
        text: {
          DEFAULT: "#ffffff",
          muted: "#a3a3a3",
        }
      },
      keyframes: {
        "logo-zoom-in": {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },
        "logo-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
        "logo-zoom-out": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(0.8)" },
        },
      },
      animation: {
        "logo-reveal": "logo-zoom-in 0.5s ease-out forwards, logo-pulse 0.5s ease-in-out 0.5s 3, logo-zoom-out 0.5s ease-in 2s forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;