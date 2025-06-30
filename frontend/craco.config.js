const path = require("path")

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  babel: {
    plugins: [process.env.NODE_ENV === "development" && require.resolve("react-refresh/babel")].filter(Boolean),
  },
}
