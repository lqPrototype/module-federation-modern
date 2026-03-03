# Module Federation Modern (Nx Monorepo)

基于 `Modern.js + Module Federation + BFF` 的微前端演示仓库，核心目标：

- Host 挂载 Remote（组件级 + 应用级）
- 统一 SSO 登录（Auth + BFF + 跨应用 Cookie）
- Showcase 营销页与后台入口联动
- Nx 管理多应用构建与运行

## 项目目录（按当前仓库）

```text
module-federation-modern/
├─ package.json
├─ nx.json
├─ pnpm-workspace.yaml
└─ packages/
   ├─ host/                  # 主应用（容器）
   │  ├─ src/
   │  ├─ modern.config.ts
   │  └─ module-federation.config.ts
   ├─ remote-app/            # 远程子应用
   │  ├─ src/
   │  ├─ modern.config.ts
   │  └─ module-federation.config.ts
   ├─ sso-utils/             # SSO MF 工具远程应用（仅暴露 ./client）
   │  ├─ src/
   │  ├─ modern.config.ts
   │  └─ module-federation.config.ts
   ├─ auth-app/              # 登录页应用
   │  ├─ src/
   │  └─ modern.config.ts
   ├─ showcase-ssg/          # SSG 展示页（登录后进入主应用）
   │  ├─ src/
   │  └─ modern.config.ts
   ├─ bff-web/               # 认证 API（/api/*）
   │  ├─ api/lambda/
   │  └─ modern.config.ts
   └─ mock-auth-server/      # 可选 mock 服务（与 bff-web 端口冲突）
      └─ server.js
```

## 应用与端口

| 应用 | 目录 | 默认端口 | 说明 |
| --- | --- | --- | --- |
| Host | `packages/host` | `8080` | 主容器，加载 `remote-app` 与 `sso-utils` |
| Remote App | `packages/remote-app` | `3053` | 子应用，支持独立运行与被 Host 挂载 |
| SSO Utils | `packages/sso-utils` | `3099` | MF 远程工具，暴露 `ssoUtils/client` |
| Auth App | `packages/auth-app` | `8081` | 统一登录入口 |
| Showcase SSG | `packages/showcase-ssg` | `8088` | 展示页；登录后显示“进入应用” |
| BFF Web | `packages/bff-web` | `4000` | 会话检查、登录、登出等 API |
| Mock Auth Server | `packages/mock-auth-server` | `4000` | 可选调试服务，不能和 BFF 同时启动 |

## 本地域名（推荐）

建议配置 hosts，启用 `.mf.local` 跨子域 Cookie 调试：

```text
127.0.0.1 host.mf.local remote.mf.local auth.mf.local showcase.mf.local api.mf.local
```

访问地址：

- Host: `http://host.mf.local:8080`
- Remote: `http://remote.mf.local:3053`
- SSO Utils: `http://localhost:3099`（通常作为 MF remote，不直接访问页面）
- Auth: `http://auth.mf.local:8081`
- Showcase: `http://showcase.mf.local:8088`
- BFF API: `http://api.mf.local:4000`

## 快速开始

1. 安装依赖

```bash
pnpm install
```

2. 启动核心服务（Nx）

```bash
pnpm run app-verbose
```

等价命令：

```bash
pnpm nx run-many --target=serve -p host,remote-app,auth-app,showcase-ssg,bff-web,sso-utils --parallel=6 --output-style=stream
```

3. 访问展示页

- `http://showcase.mf.local:8088`

4. 构建全部核心应用

```bash
pnpm run build
```

## 当前 Nx 项目

```text
host
remote-app
sso-utils
auth-app
showcase-ssg
bff-web
mock-auth-server
```

## Module Federation 关系

- `host` remotes
  - `remote@http://localhost:3053/static/mf-manifest.json`
  - `ssoUtils@http://localhost:3099/static/mf-manifest.json`
- `remote-app` remotes
  - `ssoUtils@http://localhost:3099/static/mf-manifest.json`
- `remote-app` exposes
  - `./Image`
  - `./Button`
  - `./app`
- `sso-utils` exposes
  - `./client`

## 认证流程（SSO）

1. 业务应用（host / remote / showcase）请求 `GET /api/session`。
2. 未登录时跳转到 `auth-app/?redirect=<来源地址>`。
3. `auth-app` 调用 `POST /api/login`。
4. `bff-web` 下发 `mf_sso_token` / `mf_sso_user` Cookie。
5. 登录完成后回跳来源地址。
6. 已登录状态下，showcase 顶部显示用户头像下拉（可退出），并显示“进入应用”按钮。

## BFF API（`packages/bff-web/api/lambda`）

- `POST /api/login`
- `GET /api/session`
- `POST /api/logout`
- `GET /api/dashboard`（登录态示例数据）

## 常用命令

```bash
# 查看 Nx 项目
pnpm nx show projects

# 单独启动 Host
pnpm nx run host:serve

# 单独启动 Remote
pnpm nx run remote-app:serve

# 单独启动 SSO Utils
pnpm nx run sso-utils:serve

# 单独启动 Auth
pnpm nx run auth-app:serve

# 单独启动 Showcase
pnpm nx run showcase-ssg:serve

# 单独启动 BFF
pnpm nx run bff-web:serve
```

## 注意事项

- `bff-web` 与 `mock-auth-server` 默认都使用 `4000`，不要同时运行。
- 生产环境建议将各应用端口、域名和 `MF_SSO_UTILS_REMOTE` 显式配置到环境变量。
- `sso-utils` 当前以 MF 方式对外暴露 `client`，主子应用通过 `loadRemote('ssoUtils/client')` 使用。

## 参考文档

- Modern.js: <https://modernjs.dev/zh/>
- Module Federation: <https://module-federation.io/zh/>
- Nx: <https://nx.dev/>
