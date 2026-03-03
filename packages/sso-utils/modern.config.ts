import { appTools, defineConfig } from '@modern-js/app-tools';
import { moduleFederationPlugin } from '@module-federation/modern-js-v3';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

export default defineConfig({
  dev: {
    server: {
      headers: CORS_HEADERS,
    },
  },
  server: {
    port: 3199,
    ssr: {
      mode: 'stream',
    },
    headers: CORS_HEADERS,
  },
  tools: {
    bundlerChain(chain, { isServer }) {
      if (!isServer) {
        chain.output.publicPath('auto');
      }
    },
  },
  plugins: [appTools(), moduleFederationPlugin()],
});
