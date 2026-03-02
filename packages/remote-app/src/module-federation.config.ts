import { createModuleFederationConfig } from '@module-federation/modern-js-v3';

export default createModuleFederationConfig({
  name: 'remote',
  // dts: false,
  dev: {
    // disableDynamicRemoteTypeHints: true,
  },
  filename: 'static/remoteEntry.js',
  manifest: {
    filePath: 'static',
  },
  bridge: {
    // 启用 Bridge Router 路由能力，默认为 true
    enableBridgeRouter: true,
  },
  exposes: {
    './Image': './src/components/Image.tsx',
    './Button': './src/components/Button.tsx',
    './app': './src/export-app.tsx', // 导出整个应用
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
