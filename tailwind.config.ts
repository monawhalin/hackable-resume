import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        neon: "var(--neon)",
        neon2: "var(--neon2)",
        grid: "var(--grid)"
      }
    }
  },
  plugins: []
};

export default config;
