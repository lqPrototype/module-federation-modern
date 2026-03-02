import { appTools, defineConfig } from '@modern-js/app-tools';
import { moduleFederationPlugin } from '@module-federation/modern-js-v3';
import { tailwindcssPlugin } from '@modern-js/plugin-tailwindcss';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  plugins: [appTools(), moduleFederationPlugin(), tailwindcssPlugin()],
  tools: {
    bundlerChain(chain) {
      chain.resolve.set('preferAbsolute', true);
      chain.resolve.symlinks(true);
    },
  },
  server: {
    ssr: {
      mode: 'stream',
    },
    port: 3053,
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
