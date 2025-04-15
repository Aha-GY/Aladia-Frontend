import { screens } from './assets/style/tailwind/screens.js';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [],
  theme: {
    screens: {
      ...screens,
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      fontWeight: {
        thin: 100,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
      },
      fontSize: {
        8: '0.5rem', // text-8
        9: '0.5625rem', // text-9
        10: '0.625rem', // text-10
        11: '0.6875rem', // text-11
        13: '0.8125rem', // text-13
      },
      borderRadius: {
        5: '5px',
      },
      animation: {
        zoomLoop: 'zoomLoop 1.5s infinite',
      },
      keyframes: {
        zoomLoop: {
          '0%, 100%': { transform: 'scale(1)' }, // 初始和结束时为 1 倍大小
          '50%': { transform: 'scale(1.1)' }, // 中间时缩放至 1.1 倍大小
        },
      },
    },
  },
  plugins: [],
};
