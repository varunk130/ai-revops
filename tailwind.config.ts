import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Lifted slate ramp for legible muted text on the dark graphite background.
        // Monotonic (400 lightest → 700 darkest); all clear AA contrast on #0B0E13.
        slate: {
          400: "#B3BDCD",
          500: "#A1ADBF",
          600: "#8F9CB0",
          700: "#7E8CA1",
        },
        graphite: {
          DEFAULT: "#0B0E13",
          950: "#080A0E",
          900: "#0B0E13",
          800: "#10141C",
          700: "#161C27",
          600: "#1E2533",
          500: "#2A3343",
        },
        atlas: {
          DEFAULT: "#4EA8FF",
          soft: "#86C4FF",
          dim: "#3B83D0",
        },
        // pod accents
        gtm: "#34D399", // emerald
        partner: "#FBBF24", // amber
        revops: "#A78BFA", // violet
        win: "#34D399",
        loss: "#FB7185",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        atlas: "0 0 0 1px rgba(78,168,255,0.25), 0 0 28px -4px rgba(78,168,255,0.4)",
        panel: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 14px 44px -16px rgba(0,0,0,0.72)",
      },
      keyframes: {
        "pulse-node": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(78,168,255,0.45)" },
          "50%": { boxShadow: "0 0 0 8px rgba(78,168,255,0)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-node": "pulse-node 1.6s ease-out infinite",
        "fade-up": "fade-up 0.35s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
