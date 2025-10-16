export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      colors: {
        primary: {
          DEFAULT: "#059669",
          dark: "#047857",
        },
      },
      boxShadow: {
        side: "-8px 0 24px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};
