/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.pug", // Đường dẫn đến các file Pug
    "./public/js/**/*.js", // Nếu có file JS tùy chỉnh
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          600: "#f2f1f1",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // Plugin cho form đẹp hơn
  ],
};
