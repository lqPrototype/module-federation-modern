import { createModuleFederationConfig } from '@module-federation/modern-js-v3';

export default createModuleFederationConfig({
  name: 'ssoUtils',
  filename: 'static/js/ssoUtils.js',
  exposes: {
    './client': './src/client/index.ts',
  },
});
