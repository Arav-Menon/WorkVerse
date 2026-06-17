/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Raleway"', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      animation: {
        "slow-drift": "drift 20s ease-in-out infinite",
        "slow-drift-reverse": "drift-reverse 25s ease-in-out infinite",
        "scan": "scan 10s linear infinite",
        "shimmer": "shimmer 3s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(10%, 10%)" },
        },
        "drift-reverse": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(-10%, -10%)" },
        },
      },
    },
  },
  plugins: [],
}
