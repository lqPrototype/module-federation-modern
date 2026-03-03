import { createModuleFederationConfig } from '@module-federation/modern-js-v3';

export default createModuleFederationConfig({
  name: 'ssoUtils',
  manifest: {
    filePath: 'static',
  },
  exposes: {
    './client': './src/client/index.ts',
  },
});
