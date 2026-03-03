export type SessionState = {
  loggedIn: boolean;
};

export type SessionListener = (session: SessionState) => void;

export type AuthContract = {
  getSession: (options?: { force?: boolean }) => Promise<SessionState>;
  requireAuth: (options?: { redirectUrl?: string }) => Promise<boolean>;
  subscribe: (listener: SessionListener) => () => void;
  logout: () => Promise<void>;
};

type CreateAuthContractOptions = {
  sessionCacheMs: number;
  getApiOrigin: () => string;
  getAuthOrigin: () => string;
};

export type GetOrCreateSsoAuthContractOptions = {
  globalKey?: string;
  sessionCacheMs?: number;
  getApiOrigin: () => string;
  getAuthOrigin: () => string;
};

const DEFAULT_GLOBAL_KEY = '__MF_AUTH_CONTRACT__';
const DEFAULT_SESSION_CACHE_MS = 3000;
const CSRF_COOKIE_KEY = 'mf_csrf_token';

const isBrowser = () => typeof window !== 'undefined';

const readCookieValue = (cookieKey: string): string => {
  if (!isBrowser()) {
    return '';
  }

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [rawKey, ...rest] = cookie.trim().split('=');
    if (rawKey !== cookieKey) {
      continue;
    }
    return decodeURIComponent(rest.join('='));
  }
  return '';
};

export const isAuthContract = (value: unknown): value is AuthContract => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<AuthContract>;
  return (
    typeof candidate.getSession === 'function' &&
    typeof candidate.requireAuth === 'function' &&
    typeof candidate.subscribe === 'function' &&
    typeof candidate.logout === 'function'
  );
};

const createAuthContract = (options: CreateAuthContractOptions): AuthContract => {
  let inFlightSession: Promise<SessionState> | null = null;
  let cachedSession: SessionState | null = null;
  let cacheAt = 0;
  let redirecting = false;
  const listeners = new Set<SessionListener>();

  const notify = (session: SessionState) => {
    listeners.forEach(listener => listener(session));
  };

  const getSession: AuthContract['getSession'] = async sessionOptions => {
    if (!isBrowser()) {
      return { loggedIn: false };
    }

    const now = Date.now();
    if (!sessionOptions?.force && cachedSession && now - cacheAt < options.sessionCacheMs) {
      return cachedSession;
    }

    if (inFlightSession) {
      return inFlightSession;
    }

    inFlightSession = fetch(`${options.getApiOrigin()}/api/session`, {
      credentials: 'include',
    })
      .then(async response => {
        if (!response.ok) {
          return { loggedIn: false };
        }
        const data = (await response.json()) as { loggedIn?: boolean };
        return { loggedIn: Boolean(data.loggedIn) };
      })
      .catch(() => ({ loggedIn: false }))
      .then(session => {
        cachedSession = session;
        cacheAt = Date.now();
        notify(session);
        return session;
      })
      .finally(() => {
        inFlightSession = null;
      });

    return inFlightSession;
  };

  const requireAuth: AuthContract['requireAuth'] = async requireOptions => {
    if (!isBrowser()) {
      return false;
    }

    const session = await getSession();
    if (session.loggedIn) {
      return true;
    }

    if (!redirecting) {
      redirecting = true;
      const redirect = encodeURIComponent(requireOptions?.redirectUrl ?? window.location.href);
      window.location.replace(`${options.getAuthOrigin()}/?redirect=${redirect}`);
    }
    return false;
  };

  const subscribe: AuthContract['subscribe'] = listener => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const logout: AuthContract['logout'] = async () => {
    try {
      await fetch(`${options.getApiOrigin()}/api/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': readCookieValue(CSRF_COOKIE_KEY),
        },
      });
    } finally {
      const nextSession = { loggedIn: false };
      cachedSession = nextSession;
      cacheAt = Date.now();
      redirecting = false;
      notify(nextSession);
    }
  };

  return { getSession, requireAuth, subscribe, logout };
};

export const getOrCreateSsoAuthContract = (
  options: GetOrCreateSsoAuthContractOptions,
): AuthContract => {
  const globalKey = options.globalKey ?? DEFAULT_GLOBAL_KEY;
  const sessionCacheMs = options.sessionCacheMs ?? DEFAULT_SESSION_CACHE_MS;

  if (!isBrowser()) {
    return createAuthContract({
      sessionCacheMs,
      getApiOrigin: options.getApiOrigin,
      getAuthOrigin: options.getAuthOrigin,
    });
  }

  const browserWindow = window as Window & Record<string, unknown>;
  const cached = browserWindow[globalKey];
  if (isAuthContract(cached)) {
    return cached;
  }

  const created = createAuthContract({
    sessionCacheMs,
    getApiOrigin: options.getApiOrigin,
    getAuthOrigin: options.getAuthOrigin,
  });
  browserWindow[globalKey] = created;
  return created;
};
