import React from 'react';
export type RemoteRuntimeConfig = {
    logoutRedirectUrl?: string;
};
type RemoteRuntimeConfigProviderProps = {
    value?: RemoteRuntimeConfig;
    children: React.ReactNode;
};
export declare const RemoteRuntimeConfigProvider: ({ value, children, }: RemoteRuntimeConfigProviderProps) => React.JSX.Element;
export declare const useRemoteRuntimeConfig: () => RemoteRuntimeConfig;
export {};
