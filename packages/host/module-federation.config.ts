import { createModuleFederationConfig } from '@module-federation/modern-js-v3';

export default createModuleFederationConfig({
  name: 'host',
  remotes: {
    remote: 'remote@http://localhost:3053/static/mf-manifest.json'
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true }
  }
});
