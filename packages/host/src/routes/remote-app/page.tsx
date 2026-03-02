import React from 'react';
import { createRemoteAppComponent } from '@module-federation/modern-js-v3/react';
import { loadRemote } from '@module-federation/modern-js-v3/runtime';
import RemoteAppLoading from '../../components/RemoteAppLoading';
import RemoteAppFallback from '../../components/RemoteAppFallback';

const RemoteAppCreate = createRemoteAppComponent({
  loader: () => loadRemote('remote/app'),
  loading: <RemoteAppLoading />,
  fallback: RemoteAppFallback,
});

const RemoteAppComponent = () => (
  <RemoteAppCreate
    basename="/remote-app"
    className="remote-app-root"
    style={{ width: '100%', height: '100%' }}
  />
);

export default RemoteAppComponent;
