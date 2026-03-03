import {
  AppstoreOutlined,
  HomeOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from '@modern-js/runtime/router';
import { Avatar, Dropdown, Layout, Menu, Space, Typography, message } from 'antd';
import type { MenuProps } from 'antd';
import { useEffect, useState } from 'react';
import {
  ensureAuthenticated,
  getAuthContract,
  getHostOrigin,
  getRemoteLogoutRedirect,
  getSessionUser,
} from '../utils/sso';
import './index.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [sessionUser, setSessionUser] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const hideUserActionsWhenEmbedded =
    typeof window !== 'undefined' &&
    (window.location.origin === getHostOrigin() || window.self !== window.top);

  useEffect(() => {
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

  if (!authChecked) {
    return <div className="p-6 text-slate-600">正在验证登录状态...</div>;
  }

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
      window.location.href = getRemoteLogoutRedirect();
    } catch {
      message.error('退出失败，请稍后重试。');
    } finally {
      setLogoutLoading(false);
    }
  };

  const avatarText = (sessionUser || 'OP').slice(0, 2).toUpperCase();

  const menuItems: MenuProps['items'] = [
    {
      key: '/home',
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: '/orders',
      icon: <ShoppingCartOutlined />,
      label: 'Orders',
    },
    {
      key: '/products',
      icon: <AppstoreOutlined />,
      label: 'Products',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      key: '/users',
      icon: <TeamOutlined />,
      label: 'Users',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const selectedKey =
    menuItems?.map(item => String(item?.key)).find(key => location.pathname.startsWith(key)) ??
    '/home';

  return (
    <Layout style={{ minHeight: '100vh', width: '100%' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            height: 32,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          {collapsed ? 'MF' : 'Module Federation'}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ margin: 0 }}>Remote 应用</h2>
          {!hideUserActionsWhenEmbedded ? (
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
              trigger={['click']}
            >
              <div style={{ cursor: logoutLoading ? 'not-allowed' : 'pointer' }}>
                <Space size={8}>
                  <Text>{sessionUser || '当前用户'}</Text>
                  <Avatar style={{ backgroundColor: '#1f3d96', opacity: logoutLoading ? 0.65 : 1 }}>
                    {avatarText}
                  </Avatar>
                </Space>
              </div>
            </Dropdown>
          ) : null}
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: '#fff',
            display: 'block',
            minWidth: 0,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
