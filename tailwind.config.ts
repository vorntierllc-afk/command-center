import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#09111f",
        panel: "#0f1728",
        signal: "#f4b942",
        mint: "#86efac",
        coral: "#fb7185"
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 20px 70px rgba(244, 185, 66, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
