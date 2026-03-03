const MF_DOMAIN_SUFFIX = '.mf.local';
const AUTH_PORT = '8081';
const API_PORT = '4000';
const HOST_PORT = '8080';
const SHOWCASE_PORT = '8088';

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

const ALLOWED_REDIRECT_HOSTS = new Set([
  'localhost:8080',
  'localhost:3053',
  'localhost:8088',
  'host.mf.local:8080',
  'remote.mf.local:3053',
  'showcase.mf.local:8088',
]);

export const getAuthOrigin = () => buildOrigin('auth', AUTH_PORT);

export const getApiOrigin = () => buildOrigin('api', API_PORT);

export const getHostOrigin = () => buildOrigin('host', HOST_PORT);

export const getShowcaseOrigin = () => buildOrigin('showcase', SHOWCASE_PORT);

export const resolveRedirectTarget = (rawRedirect: string | null) => {
  const fallback = getShowcaseOrigin();
  if (!rawRedirect) {
    return fallback;
  }

  try {
    const parsed = new URL(rawRedirect);
    if (ALLOWED_REDIRECT_HOSTS.has(parsed.host)) {
      return parsed.toString();
    }
  } catch {
    return fallback;
  }

  return fallback;
};
