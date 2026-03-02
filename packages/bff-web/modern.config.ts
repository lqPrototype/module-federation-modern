import { appTools, defineConfig } from '@modern-js/app-tools';
import { bffPlugin } from '@modern-js/plugin-bff';

export default defineConfig({
  server: {
    port: 4000,
  },
  bff: {
    prefix: '/api',
    httpMethodDecider: 'functionName',
  },
  plugins: [appTools(), bffPlugin()],
});
