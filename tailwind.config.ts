import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#0A0A0A",
          charcoal: "#1A1A1A",
          graphite: "#3D3D3D",
          silver: "#C0C0C0",
          platinum: "#E5E5E5",
          "off-white": "#FAFDFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-montserrat)"],
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: "0% center" },
          to: { backgroundPosition: "200% center" },
        },
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
