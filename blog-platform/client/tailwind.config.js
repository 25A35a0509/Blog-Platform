/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Warm "paper" backgrounds for light mode, deep "ink" for dark mode
        paper: {
          light: '#FBF8F2',
          dark: '#13141A',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1C1E27',
        },
        ink: {
          50: '#f4f5f9',
          100: '#e6e8f0',
          200: '#cdd1e0',
          300: '#a3a9c2',
          400: '#7a82a4',
          500: '#5a6186',
          600: '#454c6c',
          700: '#363b54',
          800: '#262a3d',
          900: '#1a1c2b',
        },
        primary: {
          50: '#eef1ff',
          100: '#dee3ff',
          200: '#c1ccff',
          300: '#9aabff',
          400: '#7484fd',
          500: '#4f5ff0',
          600: '#3a44d6',
          700: '#2f37ad',
          800: '#2b3189',
          900: '#272c6e',
        },
        accent: {
          50: '#fdf8ec',
          100: '#faeec9',
          200: '#f4da93',
          300: '#edc35c',
          400: '#e3aa37',
          500: '#cf8f27',
          600: '#ad701e',
          700: '#8a571c',
          800: '#71461c',
          900: '#5f3b1c',
        },
      },
      fontFamily: {
        display: ['"Lora"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        soft: '0 2px 12px -4px rgba(26, 28, 43, 0.08)',
        'soft-lg': '0 8px 30px -8px rgba(26, 28, 43, 0.16)',
      },
    },
  },
  plugins: [],
};
