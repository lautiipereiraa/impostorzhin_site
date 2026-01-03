export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00f0ff",
        secondary: "#7000ff",
        danger: "#ff2a6d",
        dark: "#050510",
        surface: "rgba(255, 255, 255, 0.05)"
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
