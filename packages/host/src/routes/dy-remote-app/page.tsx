import { useLocation } from '@modern-js/runtime/router';
import { createRemoteAppComponent } from '@module-federation/modern-js-v3/react';
import { loadRemote, registerRemotes } from '@module-federation/modern-js-v3/runtime';
import { Button, Space, Typography } from 'antd';
import { ComponentType, useEffect, useMemo, useState } from 'react';

const { Paragraph } = Typography;

const DYNAMIC_REMOTE_NAME = 'dy-remote-app';
const DYNAMIC_REMOTE_ENTRY = 'http://localhost:3053/static/mf-manifest.json';
const DYNAMIC_REMOTE_STORAGE_KEY = 'mf:dy-remote-app:loaded';
const DYNAMIC_REMOTE_BASENAME = '/dy-remote-app';

export default function Page() {
  const { pathname } = useLocation();
  const [remoteReady, setRemoteReady] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const registerDynamicRemote = (forceReload: boolean) => {
    registerRemotes(
      [
        {
          name: DYNAMIC_REMOTE_NAME,
          alias: DYNAMIC_REMOTE_NAME,
          entry: DYNAMIC_REMOTE_ENTRY,
        },
      ],
      { force: true },
    );

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(DYNAMIC_REMOTE_STORAGE_KEY, '1');
    }

    setRemoteReady(true);

    if (forceReload) {
      // Re-create remote component instance and trigger runtime re-fetch behavior.
      setReloadToken(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const loadedBefore = window.sessionStorage.getItem(DYNAMIC_REMOTE_STORAGE_KEY) === '1';
    const isRemoteRoute =
      pathname === DYNAMIC_REMOTE_BASENAME || pathname.startsWith(`${DYNAMIC_REMOTE_BASENAME}/`);

    if (loadedBefore || isRemoteRoute) {
      registerDynamicRemote(false);
    }
    // Bootstrap once on route entry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadDynamicApp = () => {
    registerDynamicRemote(false);
  };

  const handleRefreshDynamicApp = () => {
    registerDynamicRemote(true);
  };

  const DynamicRemoteApp = useMemo<ComponentType<any> | null>(() => {
    if (!remoteReady) {
      return null;
    }

    return createRemoteAppComponent({
      loader: () => loadRemote('dy-remote-app/app'),
      loading: <div>正在连接远程服务器...</div>,
      fallback: ({ error }) => <div>远程应用加载失败: {error.message}</div>,
    });
  }, [remoteReady, reloadToken]);

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Paragraph style={{ marginBottom: 0 }}>
        运行时动态注册 <code>dy-remote-app/app</code>。刷新页面后会自动恢复加载状态，
        在当前路由下继续同步渲染。
      </Paragraph>
      <Paragraph style={{ marginBottom: 0 }} type="secondary">
        远程入口: <code>{DYNAMIC_REMOTE_ENTRY}</code>
      </Paragraph>
      <Space>
        <Button type="primary" onClick={handleLoadDynamicApp}>
          动态加载远程应用
        </Button>
        <Button onClick={handleRefreshDynamicApp} disabled={!remoteReady}>
          刷新远程定义并重载
        </Button>
      </Space>
      {DynamicRemoteApp ? (
        <DynamicRemoteApp
          basename={DYNAMIC_REMOTE_BASENAME}
          className="remote-app-root"
          style={{ width: '100%' }}
        />
      ) : null}
    </Space>
  );
}
