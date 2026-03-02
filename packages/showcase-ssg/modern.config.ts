import { appTools, defineConfig } from '@modern-js/app-tools';
import { ssgPlugin } from '@modern-js/plugin-ssg';
import { tailwindcssPlugin } from '@modern-js/plugin-tailwindcss';

export default defineConfig({
  server: {
    ssr: process.env.NODE_ENV === 'development',
    port: 8088,
  },
  output: {
    ssg: true,
  },
  source: {
    transformImport: [
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
      },
    ],
  },
  plugins: [appTools(), ssgPlugin(), tailwindcssPlugin()],
});
