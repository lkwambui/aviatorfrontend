export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Poppins'", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      backgroundImage: {
        "linear-to-br": "linear-gradient(to bottom right, var(--tw-gradient-stops))",
        "linear-to-r": "linear-gradient(to right, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-thin": {
          "scrollbar-width": "thin",
        },
        ".scrollbar-thumb-gray-700": {
          "scrollbar-color": "rgb(55 65 81) transparent",
        },
        ".scrollbar-track-gray-800": {
          "scrollbar-color": "rgb(55 65 81) rgb(31 41 55)",
        },
      });
    },
  ],
};
