/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs", "./node_modules/preline/dist/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        lightBlack: "#111827",
        lightBlue: "#617BFF",
        blueDark: "#4766FF",
        cream: "#FEF9FF",
        golden: "#F5B841",
        yellowMain: "#ff0",
      },
    },
  },
  plugins: [require("preline/plugin")],
};
