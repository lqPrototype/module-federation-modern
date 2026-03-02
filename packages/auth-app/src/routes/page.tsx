import { Alert, Button, Card, ConfigProvider, Form, Input, Space } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { getApiOrigin, resolveRedirectTarget } from '../utils/sso';
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

  const redirectTarget = useMemo(() => {
    if (typeof window === 'undefined') {
      return resolveRedirectTarget(null);
    }
    const params = new URLSearchParams(window.location.search);
    return resolveRedirectTarget(params.get('redirect'));
  }, []);

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
              <p className="auth-desc">使用企业账号安全登录，自动跳转到目标业务系统。</p>
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
                    description="可以直接返回目标业务系统。"
                  />
                  <Button type="primary" size="large" block onClick={handleContinue}>
                    继续进入系统
                  </Button>
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
                    登录
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
