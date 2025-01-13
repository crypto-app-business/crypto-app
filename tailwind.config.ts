import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
    },
    colors: {
      primary: "#468EF9",
      secondary: "#0C66EE",
      blue: "#2F7CF0",
      black: "#222222",
      white: "#ffff",
      gray: "#666666",
      lightgray: "#DDDDDD",
      green: "#28C165",
      red: "#F4574D",
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(180deg, #293954 39%, #293954 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config;
