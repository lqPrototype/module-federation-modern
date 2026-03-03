export type SessionState = {
    loggedIn: boolean;
};
export type SessionListener = (session: SessionState) => void;
export type AuthContract = {
    getSession: (options?: {
        force?: boolean;
    }) => Promise<SessionState>;
    requireAuth: (options?: {
        redirectUrl?: string;
    }) => Promise<boolean>;
    subscribe: (listener: SessionListener) => () => void;
    logout: () => Promise<void>;
};
export type GetOrCreateSsoAuthContractOptions = {
    globalKey?: string;
    sessionCacheMs?: number;
    getApiOrigin: () => string;
    getAuthOrigin: () => string;
};
export declare const isAuthContract: (value: unknown) => value is AuthContract;
export declare const getOrCreateSsoAuthContract: (options: GetOrCreateSsoAuthContractOptions) => AuthContract;
