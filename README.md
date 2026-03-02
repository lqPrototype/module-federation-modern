# Module Federation Modern (Nx Monorepo)

该仓库是一套基于 Modern.js 3.0 + Module Federation + BFF 的微前端示例，覆盖以下场景：

- Host 挂载 Remote（组件级和整应用级）
- 统一 SSO 登录（Auth 子应用）
- BFF 统一会话与 Cookie 下发
- SSG 展示站登录回跳与后台入口

## 应用与端口

| 应用 | 目录 | 默认端口 | 说明 |
| --- | --- | --- | --- |
| Host | `packages/host` | `8080` | 主后台壳应用，加载远程模块 |
| Remote | `packages/remote-app` | `3053` | 子应用，可独立运行，也可被 Host 挂载 |
| Auth | `packages/auth-app` | `8081` | 统一登录入口 |
| BFF | `packages/bff-web` | `4000` | 统一登录态与 API 聚合 |
| Showcase SSG | `packages/showcase-ssg` | `8088` | 业务展示站，支持跳 Auth 和跳 Host |
| Mock Auth Server | `packages/mock-auth-server` | `4000` | Node 模拟认证服务（可选，和 BFF 端口冲突） |

## 本地域名（推荐）

建议使用二级域名调试共享 Cookie（`Domain=.mf.local`）：

```text
127.0.0.1 host.mf.local remote.mf.local auth.mf.local showcase.mf.local api.mf.local
```

对应访问地址：

- Host: `http://host.mf.local:8080`
- Remote: `http://remote.mf.local:3053`
- Auth: `http://auth.mf.local:8081`
- Showcase: `http://showcase.mf.local:8088` 为了SSG SEO
- BFF API: `http://api.mf.local:4000`

说明：`mock-auth-server` 默认也监听 `4000`，仅用于对比调试，不能与 `bff-web` 同时运行。

如果未配置 `hosts`，项目会自动降级到 `localhost` 方案。

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动

```bash
pnpm run app-verbose
```

### 3. 访问SEO宣传页面

> http://showcase.mf.local:8088

### 4. 构建全部应用

```bash
pnpm run build
```

## SSO 流程

1. 访问 `host` / `remote-app` / `showcase-ssg`。
2. 前端调用 BFF 的 `GET /api/session` 检查登录态。
3. 未登录则跳转 `auth-app/?redirect=<当前URL>`。
4. 在 `auth-app` 登录后调用 BFF 的 `POST /api/login`。
5. BFF 返回 `Set-Cookie`，写入 `mf_sso_token`。
6. 登录成功按 `redirect` 参数回跳原页面。
7. 后续主子应用通过 Cookie 共享登录态。

## BFF API

目录：`packages/bff-web/api/lambda`

- `POST /api/login`
- `GET /api/session`
- `POST /api/logout`
- `GET /api/dashboard`

## Host 路由

- `/`：工作台首页
- `/remote`：组件级远程模块加载（`remote/Image`、`remote/Button`）
- `/remote-app/*`：整应用远程挂载（`remote/app`）
- `/dy-remote-app/*`：运行时动态 `registerRemotes` 后加载

说明：`packages/host/src/modern.routes.ts` 中已为 `remote-app` 与 `dy-remote-app` 加了 `/*`，用于解决刷新子路由 404 问题。

## 排查文档：

- Runtime: <https://module-federation.io/zh/guide/troubleshooting/runtime.html>
- Type: <https://module-federation.io/guide/troubleshooting/type>

## 技术栈

- Nx `22.5.1`
- pnpm workspace
- Modern.js `3.0.3`
- Module Federation `2.0.1`
- React `19.2.x`
- Ant Design `4.24.15`
- TypeScript `~5.7.3`

## 参考文档

- Modern.js: <https://modernjs.dev/zh/>
- Module Federation: <https://module-federation.io/zh/>
- Nx: <https://nx.dev/>
