import { createModuleFederationConfig } from '@module-federation/modern-js-v3';

export default createModuleFederationConfig({
  name: 'host',
  // dts: false,
  dev: {
    // disableDynamicRemoteTypeHints: true,
  },
  remotes: {
    remote: 'remote@http://localhost:3053/static/mf-manifest.json',
    ssoUtils: process.env.MF_SSO_UTILS_REMOTE ?? 'ssoUtils@http://localhost:3099/static/mf-manifest.json',
  },
  shared: {
    react: {
      singleton: true,
      requiredVersion: false,
      strictVersion: false,
    },
    'react-dom': {
      singleton: true,
      requiredVersion: false,
      strictVersion: false,
    }
  }
});
