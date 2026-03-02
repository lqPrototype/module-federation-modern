import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e6f4ff',
          100: '#bae0ff',
          200: '#91caff',
          500: '#1677ff',
          700: '#0958d9',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

