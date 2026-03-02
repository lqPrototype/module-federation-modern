const MF_DOMAIN_SUFFIX = '.mf.local';
const AUTH_PORT = '8081';
const HOST_PORT = '8080';
const API_PORT = '4000';

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

export const checkSession = async () => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const response = await fetch(`${getApiOrigin()}/api/session`, {
      credentials: 'include',
    });
    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as { loggedIn?: boolean };
    return Boolean(data.loggedIn);
  } catch {
    return false;
  }
};

export const getAuthOrigin = () => buildOrigin('auth', AUTH_PORT);

export const getHostOrigin = () => buildOrigin('host', HOST_PORT);

export const redirectToAuth = () => {
  if (typeof window === 'undefined') {
    return;
  }

  const redirect = encodeURIComponent(window.location.href);
  window.location.href = `${getAuthOrigin()}/?redirect=${redirect}`;
};
