import { Alert, Button, Card, ConfigProvider, Form, Input, Space, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import {
  getApiOrigin,
  getCsrfToken,
  getShowcaseOrigin,
  resolveRedirectTarget,
} from '../utils/sso';
import './index.css';

type SessionResponse = {
  loggedIn: boolean;
};

const apiOrigin = getApiOrigin();

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authContext = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        redirectTarget: resolveRedirectTarget(null),
        hasExplicitRedirect: false,
      };
    }

    const params = new URLSearchParams(window.location.search);
    const rawRedirect = params.get('redirect');
    return {
      redirectTarget: resolveRedirectTarget(rawRedirect),
      hasExplicitRedirect: Boolean(rawRedirect),
    };
  }, []);

  const redirectTarget = authContext.redirectTarget;

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${apiOrigin}/api/session`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`session check failed: ${response.status}`);
        }
        const data = (await response.json()) as SessionResponse;
        setLoggedIn(data.loggedIn);
      } catch {
        setError('会话检测失败，请确认 bff-web 服务已启动。');
      } finally {
        setChecking(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiOrigin}/api/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken(),
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`login failed: ${response.status}`);
      }

      window.location.href = redirectTarget;
    } catch {
      setError('登录失败，请检查 bff-web 和二级域名配置。');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    window.location.href = redirectTarget;
  };

  const handleGoShowcase = () => {
    window.location.href = `${getShowcaseOrigin()}/`;
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          colorInfo: '#1677ff',
          borderRadius: 12,
          fontFamily: "'Manrope', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif",
        },
      }}
    >
      <div className="auth-stage">
        <div className="auth-bg-image" />
        <div className="auth-bg-overlay" />

        <main className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-8">
          <Card className="auth-login-card w-full max-w-[620px]" bordered={false}>
            <header className="mb-8">
              <p className="auth-kicker">ENTERPRISE ACCESS ID</p>
              <h1 className="auth-title">统一身份认证平台</h1>
              <p className="auth-desc">统一承接 Host / Remote / Showcase 的登录与回跳。</p>
              <Space wrap size={8} className="mt-4">
                <Tag color="blue">Host</Tag>
                <Tag color="geekblue">Remote</Tag>
                <Tag color="cyan">Showcase</Tag>
              </Space>
            </header>

            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              {error ? <Alert type="error" showIcon message={error} /> : null}
              {checking ? <Alert type="info" showIcon message="正在检查登录状态..." /> : null}

              {!checking && loggedIn ? (
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <Alert
                    type="success"
                    showIcon
                    message="检测到有效登录态"
                    description={
                      authContext.hasExplicitRedirect
                        ? '可以直接返回来源业务页面。'
                        : '当前未指定来源页面，可返回 Showcase 首页。'
                    }
                  />
                  <Space direction="vertical" size={10} style={{ width: '100%' }}>
                    <Button type="primary" size="large" block onClick={handleContinue}>
                      {authContext.hasExplicitRedirect ? '继续进入来源系统' : '进入默认首页'}
                    </Button>
                    <Button size="large" block onClick={handleGoShowcase}>
                      前往 Showcase 首页
                    </Button>
                  </Space>
                </Space>
              ) : null}

              {!checking && !loggedIn ? (
                <Form
                  className="auth-form"
                  layout="vertical"
                  initialValues={{ username: 'admin', password: '123456' }}
                  onFinish={handleLogin}
                >
                  <Form.Item
                    label="企业账号"
                    name="username"
                    rules={[{ required: true, message: '请输入账号' }]}
                  >
                    <Input placeholder="请输入企业账号" autoComplete="username" size="large" />
                  </Form.Item>
                  <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                  >
                    <Input.Password
                      placeholder="请输入登录密码"
                      autoComplete="current-password"
                      size="large"
                    />
                  </Form.Item>

                  <Button
                    className="auth-submit-btn"
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={loading}
                  >
                    登录并继续
                  </Button>
                </Form>
              ) : null}

              <div className="auth-bottom-note">Secure SSO · 回跳地址：{redirectTarget}</div>
            </Space>
          </Card>
        </main>
      </div>
    </ConfigProvider>
  );
}
