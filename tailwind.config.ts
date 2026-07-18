import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Premium-dark surface reserved for "money moments"
        money: {
          DEFAULT: "hsl(var(--money))",
          foreground: "hsl(var(--money-foreground))",
          muted: "hsl(var(--money-muted-foreground))",
          accent: "hsl(var(--money-accent))",
          border: "hsl(var(--money-border))",
        },
      },
      borderRadius: {
        sm: "calc(var(--radius) - 3px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // display scale for authoritative numbers / hero type
        "display-lg": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "display-md": ["3.25rem", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        "display-sm": ["2.25rem", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(0, 0, 0, 0.6)",
        lifted: "0 18px 44px -14px rgba(0, 0, 0, 0.75)",
        money: "0 20px 50px -22px rgba(0, 0, 0, 0.85)",
        hard: "5px 5px 0 0 hsl(var(--foreground))",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.22, 1, 0.36, 1)",
        "in-out-soft": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
    },
  },
  plugins: [animate],
};

export default config;
