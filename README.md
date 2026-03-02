# Module Federation Modern (Nx Monorepo)

基于 `Nx + pnpm workspace + Modern.js v3 + Module Federation` 的微前端示例仓库。

包含两个应用：

- `host`：宿主应用，负责壳布局、菜单、远程模块接入
- `remote-app`：远程应用，同时暴露组件和整应用

## 技术栈

- Nx `22.5.1`
- pnpm workspace
- Modern.js `3.0.3`
- `@module-federation/modern-js-v3` `2.0.1`
- React `19.2.x`
- Ant Design `4.24.15`
- TypeScript `~5.7.3`
- Node.js `>=20`（建议 Node 22 LTS）

## 目录结构（按当前仓库）

```text
.
├── package.json
├── nx.json
├── pnpm-workspace.yaml
└── packages
    ├── host
    │   ├── module-federation.config.ts
    │   ├── modern.config.ts
    │   ├── src
    │   │   ├── modern.routes.ts
    │   │   ├── components
    │   │   │   ├── RemoteAppFallback.tsx
    │   │   │   └── RemoteAppLoading.tsx
    │   │   └── routes
    │   │       ├── layout.tsx
    │   │       ├── index.css
    │   │       ├── page.tsx
    │   │       ├── remote/page.tsx
    │   │       ├── remote-app/page.tsx
    │   │       └── dy-remote-app/page.tsx
    │   └── package.json
    └── remote-app
        ├── modern.config.ts
        ├── src
        │   ├── module-federation.config.ts
        │   ├── export-app.tsx
        │   ├── components
        │   │   ├── Button.tsx
        │   │   └── Image.tsx
        │   └── routes
        │       ├── layout.tsx
        │       ├── index.css
        │       ├── page.tsx
        │       ├── products/page.tsx
        │       ├── orders/page.tsx
        │       ├── users/page.tsx
        │       ├── settings/page.tsx
        │       └── home
        │           ├── layout.tsx
        │           ├── page.tsx
        │           └── about/page.tsx
        └── package.json
```

## 本地启动

### 1) 安装依赖

```bash
pnpm install
```

### 2) 启动两个应用（推荐）

```bash
pnpm nx run-many --target=serve --configuration=development -p host,remote-app
```

也可以使用根脚本：

```bash
pnpm app
```

### 3) 访问地址

- Host: [http://localhost:8080](http://localhost:8080)
- Remote App: [http://localhost:3053](http://localhost:3053)

## 构建

```bash
pnpm nx run-many --target=build --configuration=development -p host,remote-app
```

或：

```bash
pnpm build
```

## Host 页面与路由说明

Host 基础路由：

- `/`：总览页
- `/remote`：组件级远程加载（`remote/Image`、`remote/Button`）
- `/remote-app/*`：挂载远程整应用（`loadRemote('remote/app')`）
- `/dy-remote-app/*`：运行时动态 `registerRemotes` 后再加载整应用

说明：

- `packages/host/src/modern.routes.ts` 对 `remote-app` 和 `dy-remote-app` 路由做了 `/*` 兜底，支持子路由刷新（如 `/remote-app/products`）避免 404。

## Remote 暴露模块

`packages/remote-app/src/module-federation.config.ts` 当前暴露：

- `remote/Image` -> `./src/components/Image.tsx`
- `remote/Button` -> `./src/components/Button.tsx`
- `remote/app` -> `./src/export-app.tsx`

默认 remote 清单地址：

- `http://localhost:3053/static/mf-manifest.json`

## 参考资料

- [Modern.js 文档](https://modernjs.dev/zh/)
- [Module Federation 文档](https://module-federation.io/zh/)
- [Nx 文档](https://nx.dev/)
