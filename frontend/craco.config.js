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
    plugins: [
      // Only add React Refresh plugin in development mode, not in production builds
      process.env.NODE_ENV === "development" && 
      process.env.REACT_APP_FAST_REFRESH !== "false" &&
      require.resolve("react-refresh/babel")
    ].filter(Boolean),
  },
}
