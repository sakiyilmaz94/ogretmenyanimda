import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a",
        },
        // Sanzo Wada inspired palette — deep navy + warm gold + ivory
        navy: {
          50:  "#f0f4f9",
          100: "#d9e4ef",
          200: "#b3c9df",
          300: "#7aa4c8",
          400: "#4a7fab",
          500: "#2d6491",
          600: "#1d4e78",
          700: "#163d61",
          800: "#112e4a",
          900: "#1B3A5C",
          950: "#0c1e33",
        },
        gold: {
          50:  "#fdf7e8",
          100: "#faecca",
          200: "#f5d68a",
          300: "#eeba4a",
          400: "#e5a030",
          500: "#C8962B",
          600: "#a87820",
          700: "#8a5e18",
          800: "#6e4a16",
          900: "#573b16",
        },
        ivory: "#F7F3EE",
        sage: {
          50:  "#f0f7f4",
          100: "#d4eadf",
          200: "#a9d4bf",
          300: "#72b598",
          400: "#4a9175",
          500: "#4A7A5E",
          600: "#3a6049",
          700: "#2d4d3a",
          800: "#223a2c",
          900: "#1a2d22",
        },
      },
      fontFamily: {
        serif: ["DM Serif Display", "Georgia", "serif"],
        sans:  ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
