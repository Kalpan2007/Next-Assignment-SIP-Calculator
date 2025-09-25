// tailwind.config.ts
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
        cream: '#FFF9F0', // Light cream background
        'brand-orange': '#FF7A00', // Vibrant orange for accents
        'brand-orange-light': '#FFC999',
        'dark-text': '#2D2D2D', // Main text color
        'light-text': '#5E5E5E', // Subdued text color
        'border-color': '#EAEAEA',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'], // A clean, modern font
      },
    },
  },
  plugins: [],
};
export default config;