import React from 'react';
import { Outlet, useLocation, useNavigate } from '@modern-js/runtime/router';
import {
  Avatar,
  Dropdown,
  Input,
  Layout,
  Menu,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import type { MenuProps } from 'antd';
import { lazyLoadComponentPlugin } from '@module-federation/modern-js-v3/react';
import { getInstance } from '@module-federation/modern-js-v3/runtime';
import {
  ensureAuthenticated,
  getAuthContract,
  getSessionUser,
  getShowcaseOrigin,
} from '../utils/sso';
import 'antd/dist/antd.css';
import './index.css';

const { Sider, Header, Content } = Layout;
const { Title, Text } = Typography;

getInstance()!.registerPlugins([lazyLoadComponentPlugin()]);

const menuItems: MenuProps['items'] = [
  { key: 'home', label: '总览工作台' },
  { key: 'remote', label: 'Remote 组件中心' },
  { key: 'remote-app', label: 'Remote 应用容器' },
  { key: 'dy-remote-app', label: '动态Remote 组件中心' },
];

const menuPathMap: Record<string, string> = {
  home: '/',
  remote: '/remote',
  'dy-remote-app': '/dy-remote-app',
  'remote-app': '/remote-app',
};

const menuLabelMap: Record<string, string> = {
  home: '总览工作台',
  remote: 'Remote 组件中心',
  'remote-app': 'Remote 应用容器',
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [authChecked, setAuthChecked] = React.useState(false);
  const [logoutLoading, setLogoutLoading] = React.useState(false);
  const [sessionUser, setSessionUser] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | null = null;

    const syncSessionUser = async () => {
      const user = await getSessionUser();
      if (active) {
        setSessionUser(user);
      }
    };

    const init = async () => {
      const authContract = await getAuthContract();
      if (!active) {
        return;
      }

      unsubscribe = authContract.subscribe(session => {
        if (!active) {
          return;
        }
        setAuthChecked(session.loggedIn);
        if (session.loggedIn) {
          void syncSessionUser();
        } else {
          setSessionUser(null);
        }
      });

      const loggedIn = await ensureAuthenticated();
      if (active) {
        setAuthChecked(loggedIn);
        if (loggedIn) {
          await syncSessionUser();
        }
      }
    };

    init();

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      label: '退出登录',
      danger: true,
    },
  ];

  const handleUserMenuClick: MenuProps['onClick'] = async ({ key }) => {
    if (key !== 'logout' || logoutLoading) {
      return;
    }

    setLogoutLoading(true);
    try {
      const authContract = await getAuthContract();
      await authContract.logout();
      setAuthChecked(false);
      setSessionUser(null);
      window.location.href = `${getShowcaseOrigin()}/`;
    } catch {
      message.error('退出失败，请稍后重试。');
    } finally {
      setLogoutLoading(false);
    }
  };

  const avatarText = (sessionUser || 'OP').slice(0, 2).toUpperCase();

  if (!authChecked) {
    return <div className="p-6 text-slate-600">正在验证登录状态...</div>;
  }

  let selectedKey = 'home';
  if (pathname.startsWith('/remote-app')) {
    selectedKey = 'remote-app';
  } else if (pathname.startsWith('/dy-remote-app')) {
    selectedKey = 'dy-remote-app';
  } else if (pathname.startsWith('/remote')) {
    selectedKey = 'remote';
  }

  return (
    <Layout className="host-shell">
      <Sider
        className="host-sider"
        width={256}
        breakpoint="lg"
        collapsedWidth={76}
        collapsible
      >
        <div className="host-brand">
          <Title level={4} style={{ margin: 0, color: '#f8f9ff' }}>
            Commerce Mesh
          </Title>
          <Text style={{ color: '#b5c5e8' }}>Enterprise Console</Text>
        </div>

        <div className="host-workspace-tag">
          <Tag color="#2f54eb">Production Workspace</Tag>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          className="host-menu"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(menuPathMap[key])}
        />
      </Sider>

      <Layout>
        <Header className="host-header">
          <div className="host-header-title">
            <Title level={4} style={{ margin: 0 }}>
              {menuLabelMap[selectedKey]}
            </Title>
            <Text type="secondary">统一宿主应用承载多个业务远程模块</Text>
          </div>
          <Space size={12}>
            <Input.Search
              className="host-search"
              placeholder="搜索路由、模块、组件..."
              allowClear
            />
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
              trigger={['click']}
            >
              <div style={{ cursor: logoutLoading ? 'not-allowed' : 'pointer' }}>
                <Space size={8}>
                  <Text style={{ color: '#1f2a44' }}>{sessionUser || '当前用户'}</Text>
                  <Avatar style={{ backgroundColor: '#1f3d96', opacity: logoutLoading ? 0.65 : 1 }}>
                    {avatarText}
                  </Avatar>
                </Space>
              </div>
            </Dropdown>
          </Space>
        </Header>

        <Content className="host-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
