const MF_DOMAIN_SUFFIX = '.mf.local';
const AUTH_PORT = '8081';
const HOST_PORT = '8080';
const SHOWCASE_PORT = '8088';
const API_PORT = '4000';
const CSRF_COOKIE_KEY = 'mf_csrf_token';

export type ShowcaseSession = {
  loggedIn: boolean;
  user: string | null;
};

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

export const getApiOrigin = () => buildOrigin('api', API_PORT);

export const getSession = async (): Promise<ShowcaseSession> => {
  if (typeof window === 'undefined') {
    return { loggedIn: false, user: null };
  }

  try {
    const response = await fetch(`${getApiOrigin()}/api/session`, {
      credentials: 'include',
    });
    if (!response.ok) {
      return { loggedIn: false, user: null };
    }

    const data = (await response.json()) as { loggedIn?: boolean; user?: string | null };
    return {
      loggedIn: Boolean(data.loggedIn),
      user: data.user ?? null,
    };
  } catch {
    return { loggedIn: false, user: null };
  }
};

export const getAuthOrigin = () => buildOrigin('auth', AUTH_PORT);

export const getHostOrigin = () => buildOrigin('host', HOST_PORT);

export const getShowcaseOrigin = () => buildOrigin('showcase', SHOWCASE_PORT);

const readCookieValue = (cookieKey: string): string => {
  if (typeof document === 'undefined') {
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

export const redirectToAuth = (redirectUrl?: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  const redirect = encodeURIComponent(redirectUrl ?? window.location.href);
  window.location.href = `${getAuthOrigin()}/?redirect=${redirect}`;
};

export const logout = async () => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const response = await fetch(`${getApiOrigin()}/api/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRF-Token': readCookieValue(CSRF_COOKIE_KEY),
      },
    });
    return response.ok;
  } catch {
    return false;
  }
};
