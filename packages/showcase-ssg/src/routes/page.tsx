import { Alert, Avatar, Button, Card, ConfigProvider, Dropdown, Space, Tag, message } from 'antd';
import type { MenuProps } from 'antd';
import { useEffect, useState } from 'react';
import { getHostOrigin, getSession, getShowcaseOrigin, logout, redirectToAuth } from '../utils/sso';
import './index.css';

const projectHighlights = [
  {
    label: '微前端应用',
    value: '3',
    unit: '个',
    hint: 'host / remote-app / auth-app',
  },
  {
    label: '认证接口',
    value: '2',
    unit: '个',
    hint: '/api/session 与 /api/login',
  },
  {
    label: '登录模式',
    value: 'SSO',
    unit: '',
    hint: '跨应用共享 Cookie 会话',
  },
  {
    label: '路由联动覆盖',
    value: '100',
    unit: '%',
    hint: 'Host 与 Remote 路由可互通',
  },
];

const runtimeSignals = [
  { label: 'Host 主应用状态', value: 98 },
  { label: 'Remote 模块可用性', value: 95 },
  { label: '统一认证链路', value: 97 },
];

const verificationSteps = [
  '启动 host / remote-app / auth-app / bff-web',
  '访问 showcase-ssg 并执行统一登录',
  '进入 Host 验证远程模块加载与路由联动',
];

const coreCapabilities = [
  {
    title: '统一认证跳转链路',
    detail: '未登录时统一跳转到 auth-app，登录后回跳来源地址并保持会话。',
  },
  {
    title: '动态远程模块加载',
    detail: 'Host 通过 Module Federation 挂载 Remote，实现独立部署与运行时加载。',
  },
  {
    title: '工程化统一治理',
    detail: '通过 Nx 管理多应用任务，统一构建、运行、类型检查与依赖边界。',
  },
];

const projectModules = [
  {
    id: 'APP 01',
    title: 'Host Application',
    summary: '主容器应用，负责路由编排、远程模块挂载和页面主框架。',
    deliverable: '关键能力：动态注册 remote-app 与统一入口导航',
  },
  {
    id: 'APP 02',
    title: 'Remote Application',
    summary: '业务子模块应用，通过联邦机制暴露页面能力给 Host 消费。',
    deliverable: '关键能力：独立开发部署与按需挂载',
  },
  {
    id: 'APP 03',
    title: 'Auth Application',
    summary: '统一登录页应用，负责会话校验、登录提交与回跳处理。',
    deliverable: '关键能力：跨子域共享登录态与统一认证体验',
  },
  {
    id: 'APP 04',
    title: 'BFF Web',
    summary: '认证后端接口服务，提供会话检查与登录 API，支撑 SSO 流程。',
    deliverable: '关键能力：会话管理与鉴权接口聚合',
  },
];

const runFlow = [
  {
    stage: 'STEP 01',
    title: 'Install & Bootstrap',
    detail: '安装依赖并初始化工作区，确保所有应用包可被 Nx 识别。',
  },
  {
    stage: 'STEP 02',
    title: 'Run Project Services',
    detail: '按需启动 auth-app、bff-web、host、remote-app 与 showcase-ssg。',
  },
  {
    stage: 'STEP 03',
    title: 'SSO Login Validation',
    detail: '在展示页触发登录，检查是否成功写入会话并回跳来源应用。',
  },
  {
    stage: 'STEP 04',
    title: 'Federation Verification',
    detail: '进入 Host 检查 Remote 模块加载、路由联动与状态传递。',
  },
];

const debugScenarios = [
  {
    scene: '登录态异常',
    result: '通过 /api/session 反馈状态，页面内给出明确错误提示。',
    detail: '快速定位是否是 bff-web 未启动或跨域 Cookie 配置问题。',
  },
  {
    scene: 'Remote 加载失败',
    result: 'Host 可保留主框架并提示远程模块不可用状态。',
    detail: '用于验证联邦配置、远程入口地址与运行时注册逻辑。',
  },
  {
    scene: '回跳地址异常',
    result: 'auth-app 对 redirect 参数做解析与兜底，避免无效跳转。',
    detail: '保障登录后统一回到安全且可访问的目标地址。',
  },
];

const stackTags = [
  'Modern.js',
  'Module Federation',
  'Nx Workspace',
  'Tailwind CSS',
  'Ant Design',
  'BFF',
  'SSO',
  'TypeScript',
];

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionUser, setSessionUser] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let active = true;
    const syncSession = async () => {
      const session = await getSession();
      if (active) {
        setIsLoggedIn(session.loggedIn);
        setSessionUser(session.user);
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncSession();
      }
    };

    syncSession();
    window.addEventListener('focus', syncSession);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      active = false;
      window.removeEventListener('focus', syncSession);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let rafId = 0;
    const syncScrollState = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      rafId = window.requestAnimationFrame(() => {
        const y = window.scrollY || window.pageYOffset;
        const maxScrollable = document.documentElement.scrollHeight - window.innerHeight;
        setIsHeaderScrolled(y > 14);
        setScrollProgress(maxScrollable > 0 ? Math.min(100, (y / maxScrollable) * 100) : 0);
      });
    };

    syncScrollState();
    window.addEventListener('scroll', syncScrollState, { passive: true });
    window.addEventListener('resize', syncScrollState);
    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', syncScrollState);
      window.removeEventListener('resize', syncScrollState);
    };
  }, []);

  const handleLogin = () => {
    redirectToAuth(`${getShowcaseOrigin()}/`);
  };

  const handleOpenHost = () => {
    window.location.href = getHostOrigin();
  };

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
      const ok = await logout();
      if (!ok) {
        message.error('退出失败，请稍后重试。');
        return;
      }
      setIsLoggedIn(false);
      setSessionUser(null);
      message.success('已退出登录');
    } finally {
      setLogoutLoading(false);
    }
  };

  const avatarText = (sessionUser || 'OP').slice(0, 2).toUpperCase();

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
      <div className="showcase-stage text-slate-100">
        <div className="showcase-backdrop-image" />
        <div className="showcase-backdrop-overlay" />
        <div className="showcase-grid-mask" />
        <div className="showcase-orb showcase-orb-a" />
        <div className="showcase-orb showcase-orb-b" />
        <div className="showcase-orb showcase-orb-c" />

        <header className={`showcase-header ${isHeaderScrolled ? 'is-scrolled' : ''}`}>
          <div className="mx-auto flex w-full max-w-[1560px] items-center justify-between gap-4 px-4 py-4 md:px-8">
            <div className="flex items-center gap-3">
              <div className="showcase-logo">MF</div>
              <div>
                <p className="m-0 text-[18px] font-semibold leading-tight text-white">Module Federation Modern</p>
                <p className="m-0 text-xs text-blue-100/75">Modern.js · Nx · SSO Demonstration</p>
              </div>
            </div>

            <div className="hidden items-center gap-7 text-sm font-medium text-blue-100/75 lg:flex">
              <span>架构总览</span>
              <span>认证链路</span>
              <span>联邦模块</span>
              <span>联调步骤</span>
            </div>

            <Space wrap size={10}>
              {isLoggedIn ? (
                <Dropdown
                  menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
                  trigger={['click']}
                >
                  <Avatar
                    style={{
                      backgroundColor: '#2f7dff',
                      cursor: logoutLoading ? 'not-allowed' : 'pointer',
                      opacity: logoutLoading ? 0.7 : 1,
                    }}
                  >
                    {avatarText}
                  </Avatar>
                </Dropdown>
              ) : (
                <Button type="primary" onClick={handleLogin}>
                  登录统一认证
                </Button>
              )}
            </Space>
          </div>
          <div className="showcase-scroll-progress">
            <span style={{ width: `${scrollProgress}%` }} />
          </div>
        </header>

        <main className="showcase-main relative z-10 mx-auto flex w-full max-w-[1560px] flex-col gap-6 px-4 pb-12 md:px-8">
          <section className="showcase-top-grid grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="showcase-hero-panel showcase-hero-panel--premium showcase-top-card showcase-reveal reveal-1">
                <div className="showcase-hero-badge-row">
                  <Tag color="blue">PROJECT OVERVIEW</Tag>
                  <span className="showcase-hero-badge-note">Micro Frontend · Unified Auth · Runtime Integration</span>
                </div>
                <h1 className="showcase-headline mt-5 text-4xl font-semibold leading-[1.06] tracking-[-0.02em] text-white md:text-5xl xl:text-6xl">
                  聚焦微前端联动与统一认证
                </h1>
                <p className="mt-4 max-w-4xl text-base leading-7 text-blue-100/85 md:text-lg">
                  页面只展示和项目运行直接相关的能力，覆盖 Host、Remote、Auth 与 BFF 协同流程。
                </p>

                <div className="showcase-focus-list">
                  {['跨应用 SSO 登录回跳', 'Host 动态挂载 Remote', 'Nx 统一运行与构建'].map(item => (
                    <div key={item} className="showcase-focus-item">
                      <span className="showcase-focus-dot" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <Space wrap size={12} className="mt-7">
                  {isLoggedIn ? (
                    <Button type="primary" size="large" onClick={handleOpenHost}>
                      进入应用
                    </Button>
                  ) : null}
                </Space>

                <div className="showcase-top-metrics">
                  {projectHighlights.map((item, index) => (
                    <div
                      key={item.label}
                      className="showcase-top-metric showcase-reveal"
                      style={{ animationDelay: `${240 + index * 70}ms` }}
                    >
                      <p className="showcase-top-metric-label">{item.label}</p>
                      <p className="showcase-top-metric-value">
                        {item.value}
                        <span className="showcase-top-metric-unit">{item.unit}</span>
                      </p>
                      <p className="showcase-top-metric-hint">{item.hint}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <Card className="showcase-status-panel showcase-status-panel--premium showcase-top-card showcase-reveal reveal-2" bordered={false}>
                <p className="m-0 text-[11px] font-semibold tracking-[0.16em] text-blue-200">RUNTIME STATUS</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">当前运行状态总览</h2>
                <p className="mt-2 text-sm leading-6 text-blue-100/75">
                  通过认证状态、模块可用性与联调步骤，快速确认本地演示环境是否完整可用。
                </p>

                <div className="mt-5">
                  {isLoggedIn ? (
                    <Alert
                      type="success"
                      showIcon
                      message="认证状态：已连接"
                      description="可直接进入 Host 检查远程模块联动。"
                    />
                  ) : (
                    <Alert
                      type="info"
                      showIcon
                      message="认证状态：未连接"
                      description="请先登录再验证跨应用会话共享。"
                    />
                  )}
                </div>

                <div className="showcase-readiness-grid">
                  {runtimeSignals.map(item => (
                    <div key={item.label} className="showcase-readiness-row">
                      <div className="showcase-readiness-head">
                        <span>{item.label}</span>
                        <strong>{item.value}%</strong>
                      </div>
                      <div className="showcase-readiness-track">
                        <span style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {coreCapabilities.map((item, index) => (
              <Card
                key={item.title}
                className="showcase-impact-card showcase-reveal"
                style={{ animationDelay: `${180 + index * 100}ms` }}
                bordered={false}
              >
                <span className="inline-flex rounded-full border border-blue-300/30 bg-blue-100/10 px-3 py-1 text-xs font-semibold text-blue-200">
                  核心能力
                </span>
                <h3 className="mt-4 text-2xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-blue-100/80">{item.detail}</p>
              </Card>
            ))}
          </section>

          <section className="grid gap-6">
            <div className="lg:col-span-8">
              <div className="grid gap-4 md:grid-cols-4">
                {projectModules.map((item, index) => (
                  <Card
                    key={item.id}
                    className="showcase-module-card showcase-reveal"
                    style={{ animationDelay: `${180 + index * 90}ms` }}
                    bordered={false}
                  >
                    <p className="showcase-module-id">{item.id}</p>
                    <h3 className="m-0 text-2xl font-semibold text-white">{item.title}</h3>
                    <p className="m-0 mt-3 text-sm leading-7 text-blue-100/80">{item.summary}</p>
                    <p className="m-0 mt-4 border-t border-blue-200/20 pt-3 text-sm font-medium text-blue-200">
                      {item.deliverable}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="showcase-bottom-copy">
          <div className="showcase-bottom-copy-inner">
            Copyright © 2012-2026 module-federation-modern · 备案号：京ICP备11041704号-32222
          </div>
        </footer>
      </div>
    </ConfigProvider>
  );
}
