import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand — Primary (base: navy-600)
        navy: {
          50: "#EFF3FB",
          100: "#D9E2F4",
          200: "#B1C1E7",
          300: "#8AA1DA",
          400: "#5B78C4",
          500: "#3557B0",
          600: "#1E3A8A",
          700: "#183072",
          800: "#122459",
          900: "#0B1841",
        },
        // Brand — Accent (base: gold-400)
        gold: {
          50: "#FEF7E0",
          100: "#FDECBC",
          200: "#FBD874",
          300: "#F9C43F",
          400: "#F5B914",
          500: "#E5AB11",
          600: "#B8880D",
          700: "#8B670A",
          800: "#5D4507",
          900: "#2E2203",
        },
        // Semantic
        success: "#16A34A",
        warning: "#F59E0B",
        error: "#DC2626",
        info: "#2563EB",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
