import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        "2xl": "1300px",
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
        manrope: ["var(--font-manrope)"],
      },
      colors: {
        primary: "var(--color-primary)",
        body: "var(--color-body)",
        gray: "var(--color-gray)",
        black: "var(--color-black)",
      },
    },
  },
  plugins: [],
};

export default config;
