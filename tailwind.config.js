/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Highway theme colors
        'highway-asphalt': '#333333',
        'highway-line-yellow': '#FFCC00',
        'highway-line-white': '#FFFFFF',
        'highway-shoulder': '#A9A9A9',
        'highway-sign-blue': '#0066CC',
        'highway-sign-green': '#006633',
        'highway-sign-red': '#CC0000',
        'highway-sign-orange': '#FF6600',
        'highway-sign-brown': '#8B4513',
        'gas-gauge-empty': '#FF0000',
        'gas-gauge-half': '#FFCC00',
        'gas-gauge-full': '#00CC00',
      },
      backgroundImage: {
        'highway-lane': 'linear-gradient(to right, #FFCC00 50%, transparent 50%)',
        'highway-lane-vertical': 'linear-gradient(#FFCC00 50%, transparent 50%)',
      },
      fontFamily: {
        'highway': ['Highway Gothic', 'Arial Narrow', 'Arial', 'sans-serif'],
      },
    },
  },
  safelist: [
    'highway-road',
    'highway-lane-divider',
    'highway-sign',
    'highway-sign-blue',
    'highway-sign-green',
    'highway-sign-red',
    'highway-sign-orange',
    'highway-sign-brown',
    'billboard',
    'billboard-post',
    'gas-gauge',
    'gas-gauge-fill',
    'driving-animation',
    'highway-font'
  ],
  plugins: [],
}