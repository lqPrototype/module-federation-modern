import { createRemoteAppComponent } from '@module-federation/modern-js-v3/react';
import {
  loadRemote,
  registerRemotes,
} from '@module-federation/modern-js-v3/runtime';
import { Button, Space, Typography } from 'antd';
import { ComponentType, useState } from 'react';

const { Paragraph } = Typography;

export default function Page() {
  const [dynamicRemoteApp, setDynamicRemoteApp] =
    useState<ComponentType<any> | null>(null);

  const handleLoadDynamicApp = () => {
    registerRemotes(
      [
        {
          name: 'dy-remote-app',
          alias: 'dy-remote-app',
          entry: 'http://localhost:3053/static/mf-manifest.json',
        },
      ],
      { force: true }
    );
    // 还可以预加载
    const RemoteApp = createRemoteAppComponent({
      loader: () => loadRemote('dy-remote-app/app'),
      loading: <div>正在连接远程服务器...</div>,
      fallback: ({ error }) => <div>远程应用加载失败: {error.message}</div>,
    });

    setDynamicRemoteApp(() => RemoteApp);
  };

  const DynamicRemoteApp = dynamicRemoteApp;

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Paragraph style={{ marginBottom: 0 }}>
        点击按钮后，运行时动态注册 remote，并加载 <code>dy-remote-app/app</code>
        。
      </Paragraph>
      <Button type="primary" onClick={handleLoadDynamicApp}>
        动态运行时加载远程应用
      </Button>
      {DynamicRemoteApp ? (
        <DynamicRemoteApp
          basename="/dy-remote-app"
          className="remote-app-root"
          style={{ width: '100%' }}
        />
      ) : null}
    </Space>
  );
}
