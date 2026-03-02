
const RemoteAppLoading = () => (
  <div className="remote-app-state remote-app-state-loading">
    <div className="remote-app-state-orb" />
    <div className="remote-app-state-card">
      <p className="remote-app-state-title">正在连接远程子应用</p>
      <p className="remote-app-state-desc">
        正在初始化模块、路由与共享依赖，请稍候...
      </p>
      <div className="remote-app-state-bar">
        <span />
      </div>
    </div>
  </div>
);

export default RemoteAppLoading;