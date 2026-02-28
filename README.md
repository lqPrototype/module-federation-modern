# Module Federation Modern (Nx Monorepo)

## 中文文档

### 1. 项目简介

这是一个基于 **Nx + pnpm workspace** 的微前端示例仓库，使用 **Modern.js v3** 与 **Module Federation v2（Modern.js 插件）** 搭建双应用联动架构：

- `host`：宿主应用，负责壳层、导航、远程模块加载
- `remote-app`：远程应用，既暴露组件也暴露整应用

该仓库主要演示两种接入模式：

- 组件级接入（Component-level Federation）
- 整应用接入（App-level Federation）

### 2. 架构总览

```mermaid
flowchart LR
  H["host (port 8080)"]
  R["remote-app (port 3053)"]

  H -->|"remote/Image, remote/Button, remote/app"| R
```

关键 Federation 配置关系：

- `host` remotes
- `remote -> http://localhost:3053/static/mf-manifest.json`
- `remote-app` exposes
- `./Image`, `./Button`, `./app`

### 3. 技术栈

- Monorepo：Nx `22.5.1`
- 包管理：pnpm workspace
- 前端框架：Modern.js `3.0.3`
- 微前端：`@module-federation/modern-js-v3` `2.0.1`
- UI：Ant Design `4.24.15`
- 语言：TypeScript（`~5.7.x`）
- 渲染：React `19.2.x` + React DOM `19.2.x`
- 代码检查：Biome `1.9.4`
- Node 版本要求：`>=20`

### 4. 目录结构

```text
.
├── nx.json
├── package.json
├── pnpm-workspace.yaml
└── packages
    ├── host
    │   ├── module-federation.config.ts
    │   ├── modern.config.ts
    │   └── src/routes
    │       ├── page.tsx                # host 总览页
    │       ├── remote/page.tsx         # 组件级远程接入
    │       └── remote-app/page.tsx     # 整应用远程接入
    ├── remote-app
    │   ├── module-federation.config.ts
    │   ├── modern.config.ts
    │   └── src
    │       ├── export-app.tsx          # 暴露整应用入口（remote/app）
    │       └── components
    │           ├── Image.tsx
    │           └── Button.tsx
```

### 5. 本地启动

安装依赖：

```bash
pnpm install
```

通过 Nx 启动两个应用（推荐）：

```bash
pnpm nx run-many --target=serve --configuration=development -p host,remote-app
```

启动后访问：

- Host: [http://localhost:8080](http://localhost:8080)
- Remote App: [http://localhost:3053](http://localhost:3053)

### 6. 构建命令

```bash
pnpm nx run-many --target=build --configuration=development -p host,remote-app
```

或：

```bash
pnpm build
```

### 7. 演示路径

在 Host（`http://localhost:8080`）中重点验证：

- `/remote`：加载 `remote/Image`，并演示运行时 `registerRemotes(..., { force: true })`
- `/remote-app`：通过 `loadRemote('remote/app')` 挂载整应用
