import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        "text-secondary": "var(--text-secondary)",
        "btn-text": "var(--btn-text)",
        "accent": "var(--accent)",
        "input-border": "var(--input-border)",
        "tertiary": "var(--tertiary)",
        "btn-secondary": "var(--btn-secondary)",
        "text-body": "var(--text-body)",
        "input-bg": "var(--input-bg)"
      },
      fontFamily:{
        "isidora": "'Isidora Sans Alt', sans-serif",
        "quicksand": "'Quicksand', sans-serif"
      }
    },
  },
  plugins: [],
} satisfies Config;
