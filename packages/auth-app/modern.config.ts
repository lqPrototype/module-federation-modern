import { appTools, defineConfig } from '@modern-js/app-tools';
import { tailwindcssPlugin } from '@modern-js/plugin-tailwindcss';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 8081,
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
  plugins: [appTools(), tailwindcssPlugin()],
});
