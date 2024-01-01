/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
      },
      colors: {
        lightBlack: "#111827",
        lightBlue: "#617BFF",
        blueDark: "#4766FF",
        cream: "#FEF9FF",
        golden: "#F5B841",
      },
    },
  },
  plugins: [],
};
