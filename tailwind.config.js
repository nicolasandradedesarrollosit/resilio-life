const { heroui } = require("@heroui/theme")

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        mono: ["var(--font-mono)", "ui-monospace", 'SFMono-Regular', 'Menlo', 'Monaco', 'Roboto Mono', 'Helvetica Neue', 'monospace'],
      },
      colors: {
        'magenta-fuchsia': {
          '50': '#f6f3ff',
          '100': '#efe9fe',
          '200': '#e0d5ff',
          '300': '#c8b4fe',
          '400': '#ae89fc',
          '500': '#9659f9',
          '600': '#8837f0',
          '700': '#7925dc',
          '800': '#651eb9',
          '900': '#551b98',
          '950': '#340e67',
        }
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()]
}

module.exports = config;