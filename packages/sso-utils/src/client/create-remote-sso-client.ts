import {
  getOrCreateSsoAuthContract,
  isAuthContract,
  type AuthContract,
} from '../auth-contract';

type CreateRemoteSsoClientOptions = {
  globalKey?: string;
  sessionCacheMs?: number;
  getApiOrigin: () => string;
  getAuthOrigin: () => string;
};

const DEFAULT_GLOBAL_KEY = '__MF_AUTH_CONTRACT__';
const DEFAULT_SESSION_CACHE_MS = 3000;

export const createRemoteSsoClient = (options: CreateRemoteSsoClientOptions) => {
  const globalKey = options.globalKey ?? DEFAULT_GLOBAL_KEY;
  const sessionCacheMs = options.sessionCacheMs ?? DEFAULT_SESSION_CACHE_MS;

  const getCachedGlobalAuthContract = (): AuthContract | null => {
    if (typeof window === 'undefined') {
      return null;
    }

    const browserWindow = window as Window & Record<string, unknown>;
    const cached = browserWindow[globalKey];
    if (isAuthContract(cached)) {
      return cached;
    }
    return null;
  };

  const getAuthContract = async (): Promise<AuthContract> => {
    const cached = getCachedGlobalAuthContract();
    if (cached) {
      return cached;
    }

    return getOrCreateSsoAuthContract({
      globalKey,
      sessionCacheMs,
      getApiOrigin: options.getApiOrigin,
      getAuthOrigin: options.getAuthOrigin,
    });
  };

  const ensureAuthenticated = async () => (await getAuthContract()).requireAuth();

  return {
    getAuthContract,
    ensureAuthenticated,
  };
};
