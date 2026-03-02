import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  corePlugins: {
    preflight: false,
  },
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
          500: '#1677ff',
          600: '#4096ff',
          700: '#0958d9',
        },
      },
      boxShadow: {
        auth: '0 20px 40px rgba(22, 119, 255, 0.12)',
        'auth-hover': '0 26px 56px rgba(22, 119, 255, 0.18)',
      },
    },
  },
  plugins: [],
} satisfies Config;

