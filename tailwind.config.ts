
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
          DEFAULT: "#1a1a1a",
          accent: "#666666",
          light: "#f5f5f5",
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
          "0%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.1)" },
          "50%": { transform: "scale(1)" },
          "75%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        "logo-zoom-out": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(0.8)" },
        },
        "logo-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(-1800deg)" }, // 5 full counterclockwise rotations
        },
        "header-slide-down": {
          "0%": { 
            opacity: "0",
            transform: "translateY(-20px)"
          },
          "100%": { 
            opacity: "1",
            transform: "translateY(0)"
          }
        }
      },
      animation: {
        "logo-reveal": "logo-zoom-in 0.5s ease-out forwards, logo-pulse 4s ease-in-out 0.5s forwards, logo-spin 2s ease-in-out 4.5s forwards",
        "header-reveal": "header-slide-down 0.5s ease-out forwards"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
