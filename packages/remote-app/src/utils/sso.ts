import { loadRemote } from '@module-federation/modern-js-v3/runtime';

type SessionState = {
  loggedIn: boolean;
};

export type AuthContract = {
  getSession: (options?: { force?: boolean }) => Promise<SessionState>;
  requireAuth: (options?: { redirectUrl?: string }) => Promise<boolean>;
  subscribe: (listener: (session: SessionState) => void) => () => void;
  logout: () => Promise<void>;
};

type CreateRemoteSsoClientOptions = {
  globalKey?: string;
  sessionCacheMs?: number;
  getApiOrigin: () => string;
  getAuthOrigin: () => string;
};

type SsoClient = {
  getAuthContract: () => Promise<AuthContract>;
  ensureAuthenticated: () => Promise<boolean>;
};

type SsoUtilsClientModule = {
  createRemoteSsoClient?: (options: CreateRemoteSsoClientOptions) => SsoClient;
};

const MF_DOMAIN_SUFFIX = '.mf.local';
const AUTH_PORT = '8081';
const API_PORT = '4000';
const SESSION_CACHE_MS = 3000;
const AUTH_CONTRACT_KEY = '__MF_AUTH_CONTRACT__';
const SSO_CLIENT_REMOTE_ID = 'ssoUtils/client';

const isMfSubDomain = (hostname: string) => hostname.endsWith(MF_DOMAIN_SUFFIX);

const buildOrigin = (subdomain: string, fallbackPort: string) => {
  if (typeof window === 'undefined') {
    return `http://localhost:${fallbackPort}`;
  }

  const protocol = window.location.protocol;
  const { hostname } = window.location;
  if (isMfSubDomain(hostname)) {
    return `${protocol}//${subdomain}${MF_DOMAIN_SUFFIX}:${fallbackPort}`;
  }

  return `${protocol}//localhost:${fallbackPort}`;
};

export const getAuthOrigin = () => buildOrigin('auth', AUTH_PORT);

export const getApiOrigin = () => buildOrigin('api', API_PORT);

export const getSessionUser = async (): Promise<string | null> => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const response = await fetch(`${getApiOrigin()}/api/session`, {
      credentials: 'include',
    });
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as { user?: string | null };
    return data.user ?? null;
  } catch {
    return null;
  }
};

let ssoClientPromise: Promise<SsoClient> | null = null;

const getSsoClient = async (): Promise<SsoClient> => {
  if (ssoClientPromise) {
    return ssoClientPromise;
  }

  ssoClientPromise = loadRemote(SSO_CLIENT_REMOTE_ID)
    .then(module => {
      const createRemoteSsoClient = (module as SsoUtilsClientModule).createRemoteSsoClient;
      if (typeof createRemoteSsoClient !== 'function') {
        throw new Error(`${SSO_CLIENT_REMOTE_ID} 未导出 createRemoteSsoClient`);
      }

      return createRemoteSsoClient({
        globalKey: AUTH_CONTRACT_KEY,
        sessionCacheMs: SESSION_CACHE_MS,
        getApiOrigin,
        getAuthOrigin,
      });
    })
    .catch(error => {
      ssoClientPromise = null;
      throw error;
    });

  return ssoClientPromise;
};

export const getAuthContract = async (): Promise<AuthContract> =>
  (await getSsoClient()).getAuthContract();

export const ensureAuthenticated = async (): Promise<boolean> =>
  (await getSsoClient()).ensureAuthenticated();
