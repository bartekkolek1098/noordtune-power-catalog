import type {Config} from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1180px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        nord: {
          silver: "#d9dde3",
          blue: "#0087ff",
          red: "#e2000f",
          steel: "#8ea4b8",
          graphite: "#05070b"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 44px rgba(226, 0, 15, 0.30)"
      },
      backgroundImage: {
        carbon:
          "linear-gradient(135deg, rgba(255,255,255,0.035) 25%, transparent 25%), linear-gradient(225deg, rgba(255,255,255,0.035) 25%, transparent 25%), linear-gradient(45deg, rgba(255,255,255,0.035) 25%, transparent 25%), linear-gradient(315deg, rgba(255,255,255,0.035) 25%, hsl(var(--background)) 25%)"
      }
    }
  },
  plugins: [animate]
};

export default config;
