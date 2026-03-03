import { appTools, defineConfig } from '@modern-js/app-tools';
import { moduleFederationPlugin } from '@module-federation/modern-js-v3';
import { tailwindcssPlugin } from '@modern-js/plugin-tailwindcss';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  dev: {
    server: {
      headers: CORS_HEADERS,
    },
  },
  plugins: [appTools(), moduleFederationPlugin(), tailwindcssPlugin()],
  tools: {
    bundlerChain(chain, { isServer }) {
      if (!isServer) {
        chain.output.publicPath('auto');
      }
    },
  },
  server: {
    ssr: {
      mode: 'stream',
    },
    port: 3053,
    headers: CORS_HEADERS,
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
});
