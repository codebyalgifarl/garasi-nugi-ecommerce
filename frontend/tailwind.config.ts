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
          /** Bar navigasi atas versi desktop (lebih pekat dari navy-600) */
          deep: "#062A78",
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
          /** Kuning kartu Mercedes / Porsche / Oil Cooler (diambil dari Figma) */
          card: "#E6B335",
        },
        // Brand — Aqua (teal dari logo). Diambil dari Figma.
        aqua: {
          300: "#8FCBD9",
          /** Kartu BMW / Audi / Brake Disc */
          400: "#62B7CB",
          /** Bar kategori Headlight */
          600: "#4F98A7",
          /** Untuk TEKS link di atas putih (kontras ≥ 4.5:1) */
          700: "#1B7F92",
        },
        /** Latar footer gelap versi mobile */
        ink: "#0B1613",
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
