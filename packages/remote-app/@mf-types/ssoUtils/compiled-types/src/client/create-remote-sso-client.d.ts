import { type AuthContract } from '../auth-contract';
type CreateRemoteSsoClientOptions = {
    globalKey?: string;
    sessionCacheMs?: number;
    getApiOrigin: () => string;
    getAuthOrigin: () => string;
};
export declare const createRemoteSsoClient: (options: CreateRemoteSsoClientOptions) => {
    getAuthContract: () => Promise<AuthContract>;
    ensureAuthenticated: () => Promise<boolean>;
};
export {};
