import { createRoot as createRootModern } from '@modern-js/runtime/react';
import { createBridgeComponent } from '@module-federation/modern-js-v3/react';

const ModernApp = createRootModern();

const appProvider = createBridgeComponent({
  rootComponent: ModernApp,
});

export default appProvider;
