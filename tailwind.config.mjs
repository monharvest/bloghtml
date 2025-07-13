/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
    theme: {
        extend: {},
    },
    theme: {
  extend: {
    colors: {
      amber: {
        300: '#fcd34d',
      },
      // Add other custom colors if needed
    },
  },
},
    plugins: [],
};