/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Accessibility-focused color system
      // Ensures WCAG AA compliance (4.5:1 contrast ratio)
      colors: {
        // High contrast text colors for accessibility
        'text-primary': {
          light: '#1f2937', // gray-800 - high contrast on white
          dark: '#f9fafb',  // gray-50 - high contrast on dark
        },
        'text-secondary': {
          light: '#374151', // gray-700 - good contrast on white  
          dark: '#e5e7eb',  // gray-200 - good contrast on dark
        },
        'text-muted': {
          light: '#4b5563', // gray-600 - minimum WCAG AA on white
          dark: '#d1d5db',  // gray-300 - minimum WCAG AA on dark
        },
      },
    },
  },
  plugins: [],
  // Aggressive CSS size reduction
  corePlugins: {
    // Disable features we don't use to reduce CSS size
    backdropOpacity: false,
    backdropSaturate: false,
    backdropSepia: false,
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false,
    textOpacity: false,
    // Keep essential plugins
    preflight: true,
    container: true,
    accessibility: true,
  },
}