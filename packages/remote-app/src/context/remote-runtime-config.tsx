import React from 'react';

export type RemoteRuntimeConfig = {
  logoutRedirectUrl?: string;
};

const RemoteRuntimeConfigContext = React.createContext<RemoteRuntimeConfig>({});

type RemoteRuntimeConfigProviderProps = {
  value?: RemoteRuntimeConfig;
  children: React.ReactNode;
};

export const RemoteRuntimeConfigProvider = ({
  value,
  children,
}: RemoteRuntimeConfigProviderProps) => {
  const normalizedValue = React.useMemo<RemoteRuntimeConfig>(() => {
    const logoutRedirectUrl = value?.logoutRedirectUrl?.trim();
    return {
      logoutRedirectUrl: logoutRedirectUrl ? logoutRedirectUrl : undefined,
    };
  }, [value?.logoutRedirectUrl]);

  return (
    <RemoteRuntimeConfigContext.Provider value={normalizedValue}>
      {children}
    </RemoteRuntimeConfigContext.Provider>
  );
};

export const useRemoteRuntimeConfig = () => React.useContext(RemoteRuntimeConfigContext);
