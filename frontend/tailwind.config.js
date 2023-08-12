/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      container: {
        center: true,
      },
      colors: {
        primary: "#3B82F6",
        secondary: "rgba(217, 217, 217, 0.23)",
        bg: "#e6f7ff",
      },
    },
  },
  plugins: [],
};
