import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#e6f4ff',
          100: '#bae0ff',
          200: '#91caff',
          300: '#69b1ff',
          500: '#1677ff',
          600: '#4096ff',
          700: '#0958d9',
        },
      },
      boxShadow: {
        consult: '0 18px 36px rgba(30, 64, 175, 0.08)',
        'consult-hover': '0 24px 46px rgba(30, 64, 175, 0.13)',
      },
    },
  },
  plugins: [],
} satisfies Config;
