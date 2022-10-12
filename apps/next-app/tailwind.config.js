/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
const colors = require("tailwindcss/colors");

module.exports = {
  purge: {
    content: [
      "./components/**/*.{js,ts,jsx,tsx}",
      "./modules/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
    ],
    options: {
      safelist: [/[class~=step]$/],
    },
  },
  important: true,
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "light-blue": colors.sky,
        teal: colors.teal,
        cyan: colors.cyan,
        rose: colors.rose,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/line-clamp"), require("daisyui")],
  daisyui: {
    themes: [
      // first one will be the default theme
      "light",
      {
        "mojito-light": {
          "primary": "#4f46e5" /* Primary color */,
          "primary-focus": "#4506cb" /* Primary color - focused */,
          "primary-content": "#ffffff" /* Foreground content color to use on primary color */,

          "base-100": "#ffffff" /* Base color of page, used for blank backgrounds */,
          "base-200": "#f9fafb" /* Base color, a little darker */,
          "base-300": "#d1d5db" /* Base color, even more darker */,
          "base-content": "#1f2937" /* Foreground content color to use on base color */,
        },
      },
    ],
  },
};
