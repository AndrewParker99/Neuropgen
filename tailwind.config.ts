import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        clinical: {
          50: "#eaf7f1",
          100: "#dff3eb",
          200: "#c3e9d8",
          300: "#9bd9bd",
          400: "#61c897",
          500: "#2f8f73",
          600: "#17614f",
          700: "#125446",
          800: "#0c3c32",
          900: "#08251f"
        }
      },
      boxShadow: {
        soft: "0 18px 48px rgba(80, 69, 58, .08)"
      },
      borderRadius: {
        xl2: "22px"
      }
    }
  },
  plugins: []
};

export default config;
