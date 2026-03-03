import '@modern-js/runtime/registry/index'; // 这一行必须引入，它会默认导入微前端运行时依赖
import { render } from '@modern-js/runtime/browser';
import { createRoot } from '@modern-js/runtime/react';
import { createBridgeComponent } from '@module-federation/modern-js-v3/react-v19';
import {
  RemoteRuntimeConfigProvider,
  type RemoteRuntimeConfig,
} from './context/remote-runtime-config';

const ModernRoot = createRoot();

type RemoteBridgeProps = {
  basename?: string;
} & RemoteRuntimeConfig;

const BridgeRoot = ({ basename = '/', logoutRedirectUrl }: RemoteBridgeProps) => (
  <RemoteRuntimeConfigProvider value={{ logoutRedirectUrl }}>
    <ModernRoot basename={basename} />
  </RemoteRuntimeConfigProvider>
);

export const provider = createBridgeComponent({
  rootComponent: BridgeRoot,
  render: (Component, dom) =>
    render(Component as React.ReactElement<RemoteBridgeProps>, dom),
});

export default provider;
