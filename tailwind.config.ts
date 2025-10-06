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
        'brand-orange-hover': '#FF9900', // Slightly deeper for hover
        'brand-orange-active': '#CC6200', // For active/pressed
        'brand-orange-light': '#FFC999', // For backgrounds, highlights
        'brand-orange-disabled': '#FFDDBB', // Disabled state
        'dark-text': '#2D2D2D', // Main text color
        'light-text': '#5E5E5E', // Subdued text color
        'border-color': '#EAEAEA',
        'bg-gray': '#F5F5F5', // General background
        'gray-100': '#F3F4F6',
        'gray-200': '#E5E7EB',
        'gray-300': '#D1D5DB',
        'gray-400': '#9CA3AF',
        'gray-500': '#6B7280',
        'gray-600': '#4B5563',
        'gray-700': '#374151',
        'gray-800': '#1F2937',
        'gray-900': '#111827',
        success: '#22C55E',
        error: '#EF4444',
        warning: '#F59E42',
        info: '#3B82F6',
        white: '#FFFFFF',
        black: '#000000',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'], // A clean, modern font
      },
    },
  },
  plugins: [],
};
export default config;