const RemoteAppFallback = ({ error }: { error: Error }) => (
  <div className="remote-app-state remote-app-state-error">
    <div className="remote-app-state-card">
      <p className="remote-app-state-title">远程应用加载失败</p>
      <p className="remote-app-state-desc">
        请检查 remote 服务是否启动，或点击下方按钮重试。
      </p>
      <p className="remote-app-state-error-text">{error.message}</p>
      <button
        type="button"
        className="remote-app-state-retry"
        onClick={() => window.location.reload()}
      >
        刷新并重试
      </button>
    </div>
  </div>
);

export default RemoteAppFallback;
