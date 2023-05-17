import { type Config } from "tailwindcss";

export default {
  darkMode: "class",
  theme: {
    extend: {
      maxWidth: {
        "8xl": "90rem",
        "9xl": "100rem",
      },
      screens: {
        custom: "1200px",
      },
      backgroundColor: {
        "gray-875": "#1b2230",
      },
      boxShadow: {
        dark: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1)",
      },
      animation: {
        enter: "enter 200ms ease-out",
        "slide-in": "slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)",
        leave: "leave 150ms ease-in forwards",
      },
      keyframes: {
        enter: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        leave: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.9)", opacity: "0" },
        },
      },
    },
  },
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("@tailwindcss/forms")],
} satisfies Config;
