/** @type {import('tailwindcss').Config} */
export const content = [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    fontFamily: {
      koh: ['"Koh Santepheap"', 'serif'],
      kiwi: ['"Kiwi Maru"', 'serif'],
    },
    colors: {
      mauve: '#A38F85',
      rose: '#D4B2A7',
      ivory: '#EDE9E3',
    },
  },
};
export const plugins = [];