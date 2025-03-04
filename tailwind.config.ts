import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './app/**/*/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      aspectRatio: {
        '4/1': '4 / 1',
        '8/1': '8 / 1',
        '7/1':  '7/1',
        '2/1': '2 / 1',
        '1/4': '1 / 4',
      },
      backgroundImage: {
        'gradient-base': "radial-gradient(ellipse at top, var(--tw-color-sky-400), var(--tw-color-blue-800))",
        'gray-light-center': 'linear-gradient(to right, #cbd5e1, #e2e8f0, #cbd5e1)',
      },
      screens: {
        'g-f': '280px',
      },
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
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: "0", transform: 'translateY(20px)' },
          '100%': { opacity: "1", transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: "1", transform: 'translateY(0)' },
          '100%': { opacity: "0", transform: 'translateY(20px)' },
        },
        slideInFromRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutToRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        slideInFromLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutToLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        accordionDown: {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        accordionUp: {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        caretBlink: {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        rotate180: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(180deg)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-out': 'fadeOut 0.5s ease-out forwards',
        'slide-in-from-right': 'slideInFromRight 0.5s ease-out forwards',
        'slide-out-to-right': 'slideOutToRight 0.5s ease-out forwards',
        'slide-in-from-left': 'slideInFromLeft 0.5s ease-out forwards',
        'slide-out-to-left': 'slideOutToLeft 0.5s ease-out forwards',
        "accordion-down": "accordionDown 0.2s ease-out",
        "accordion-up": "accordionUp 0.2s ease-out",
        'shake': 'shake 1s ease-in-out',
        "caret-blink": "caretBlink 1.25s ease-out infinite",
        'rotate-180': 'rotate180 0.5s ease-in-out forwards',
      },
    },
  },
  variants: {
    extend: {
      animation: ['responsive', 'hover']
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss/plugin'),
    plugin(function({ addUtilities }) {
      const newUtilities = {
        /* Thin scrollbar for Firefox */
        '.scrollbar-thin': {
          'scrollbar-width': 'thin', // For Firefox
        },
        /* Hide scrollbar in Firefox */
        '.scrollbar-none': {
          'scrollbar-width': 'none', // For Firefox
        },
        /* Default scrollbar in Firefox */
        '.scrollbar-default': {
          'scrollbar-width': 'auto', // Default for Firefox
        },
        /* Custom track color */
        '.scrollbar-track-gray': {
          '--tw-scrollbar-track': '#f1f1f1', // Track color
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'var(--tw-scrollbar-track)', // WebKit
          },
        },
        /* Custom thumb color with rounded corners */
        '.scrollbar-thumb-blue': {
          '--tw-scrollbar-thumb': '#888', // Thumb color
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'var(--tw-scrollbar-thumb)', // WebKit
            borderRadius: '10px', // Rounded corners for thumb
          },
        },
        /* Hover style for thumb */
        '.scrollbar-thumb-blue:hover': {
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#555', // Darker thumb on hover
          },
        },
        /* Rounded corners for the scrollbar thumb */
        '.scrollbar-rounded': {
          '&::-webkit-scrollbar-thumb': {
            borderRadius: '9999px', // Fully rounded corners
          },
        },
      };

      addUtilities(newUtilities);
    }),
    require('tailwind-scrollbar-hide'),
  ],
} satisfies Config;

export default config;
