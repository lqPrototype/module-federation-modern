type BffInput = {
  headers?: Record<string, string | undefined>;
  data?: Record<string, unknown>;
  body?: Record<string, unknown>;
};

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:3053',
  'http://localhost:8081',
  'http://localhost:8088',
  'http://host.mf.local:8080',
  'http://remote.mf.local:3053',
  'http://auth.mf.local:8081',
  'http://showcase.mf.local:8088',
];

const parseMaxAge = (rawValue: string | undefined, fallback: number) => {
  if (!rawValue) {
    return fallback;
  }

  const parsed = Number.parseInt(rawValue, 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }
  return parsed;
};

const parseCsvSet = (rawValue: string | undefined, fallback: string[]) => {
  const values = (rawValue || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
  return new Set(values.length ? values : fallback);
};

const ALLOWED_ORIGINS = parseCsvSet(
  process.env.MF_SSO_ALLOWED_ORIGINS,
  DEFAULT_ALLOWED_ORIGINS,
);

const COOKIE_SAME_SITE = (process.env.MF_SSO_COOKIE_SAMESITE || 'Lax').trim() || 'Lax';
const COOKIE_SECURE =
  process.env.MF_SSO_COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';
const COOKIE_DOMAIN = (process.env.MF_SSO_COOKIE_DOMAIN || '').trim();
const SESSION_MAX_AGE = parseMaxAge(process.env.MF_SSO_SESSION_MAX_AGE, 86400);
const CSRF_MAX_AGE = parseMaxAge(process.env.MF_SSO_CSRF_MAX_AGE, SESSION_MAX_AGE);
const CSRF_COOKIE_NAME = 'mf_csrf_token';

const readHeader = (input: BffInput, name: string) => {
  const targetName = name.toLowerCase();
  const headers = input.headers || {};
  for (const [headerName, headerValue] of Object.entries(headers)) {
    if (headerName.toLowerCase() === targetName) {
      return headerValue || '';
    }
  }
  return '';
};

const readOrigin = (input: BffInput) => readHeader(input, 'origin');

const readRefererOrigin = (input: BffInput) => {
  const referer = readHeader(input, 'referer');
  if (!referer) {
    return '';
  }

  try {
    return new URL(referer).origin;
  } catch {
    return '';
  }
};

const readRequestOrigin = (input: BffInput) => {
  const origin = readOrigin(input);
  if (origin) {
    return origin;
  }
  return readRefererOrigin(input);
};

const buildCorsHeaders = (origin: string) => {
  const headers = new Headers();
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Vary', 'Origin');
  }

  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token');
  headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  headers.set('Content-Type', 'application/json; charset=utf-8');

  return headers;
};

export const createJsonResponse = (
  input: BffInput,
  data: unknown,
  status = 200,
  extraHeaders?: Headers,
) => {
  const origin = readOrigin(input);
  const headers = buildCorsHeaders(origin);

  if (extraHeaders) {
    extraHeaders.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        headers.append('Set-Cookie', value);
      } else {
        headers.set(key, value);
      }
    });
  }

  return new Response(JSON.stringify(data), {
    status,
    headers,
  });
};

export const createNoContentResponse = (input: BffInput) => {
  const origin = readOrigin(input);
  const headers = buildCorsHeaders(origin);
  return new Response(null, { status: 204, headers });
};

export const parseCookies = (cookieHeader = '') => {
  return cookieHeader.split(';').reduce<Record<string, string>>((acc, pair) => {
    const index = pair.indexOf('=');
    if (index <= 0) {
      return acc;
    }

    const key = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();
    if (key) {
      acc[key] = decodeURIComponent(value);
    }

    return acc;
  }, {});
};

const isMfDomainRequest = (origin: string, host: string) => {
  const combined = `${origin} ${host}`;
  return combined.includes('.mf.local');
};

const getCookieDomainPrefix = (input: BffInput) => {
  if (COOKIE_DOMAIN) {
    return `Domain=${COOKIE_DOMAIN}; `;
  }

  const origin = readOrigin(input);
  const host = readHeader(input, 'host');
  if (isMfDomainRequest(origin, host)) {
    return 'Domain=.mf.local; ';
  }
  return '';
};

const buildCookieAttrs = (domainPrefix: string, maxAge: number, httpOnly: boolean) => {
  const secureFlag = COOKIE_SECURE ? 'Secure; ' : '';
  const httpOnlyFlag = httpOnly ? 'HttpOnly; ' : '';
  return `${domainPrefix}Path=/; Max-Age=${maxAge}; ${secureFlag}${httpOnlyFlag}SameSite=${COOKIE_SAME_SITE}`;
};

const createCsrfToken = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replaceAll('-', '');
  }

  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
};

const buildCsrfCookie = (token: string, domainPrefix: string) =>
  `${CSRF_COOKIE_NAME}=${encodeURIComponent(token)}; ${buildCookieAttrs(domainPrefix, CSRF_MAX_AGE, false)}`;

export const buildSessionCookieHeaders = (input: BffInput) => {
  const headers = new Headers();
  const cookies = parseCookies(readHeader(input, 'cookie'));
  if (!cookies[CSRF_COOKIE_NAME]) {
    const domainPrefix = getCookieDomainPrefix(input);
    headers.append('Set-Cookie', buildCsrfCookie(createCsrfToken(), domainPrefix));
  }
  return headers;
};

export const validateCsrf = (input: BffInput) => {
  const origin = readRequestOrigin(input);
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return false;
  }

  const csrfHeader = readHeader(input, 'x-csrf-token');
  if (!csrfHeader) {
    return false;
  }

  const cookies = parseCookies(readHeader(input, 'cookie'));
  const csrfCookie = cookies[CSRF_COOKIE_NAME];
  return Boolean(csrfCookie && csrfCookie === csrfHeader);
};

export const buildLoginCookieHeaders = (input: BffInput, username: string) => {
  const domainPrefix = getCookieDomainPrefix(input);
  const cookies = parseCookies(readHeader(input, 'cookie'));
  const csrfToken = cookies[CSRF_COOKIE_NAME] || createCsrfToken();
  const headers = new Headers();

  headers.append(
    'Set-Cookie',
    `mf_sso_token=demo-token; ${buildCookieAttrs(domainPrefix, SESSION_MAX_AGE, true)}`,
  );
  headers.append(
    'Set-Cookie',
    `mf_sso_user=${encodeURIComponent(username)}; ${buildCookieAttrs(domainPrefix, SESSION_MAX_AGE, true)}`,
  );
  headers.append('Set-Cookie', buildCsrfCookie(csrfToken, domainPrefix));

  return headers;
};

export const buildLogoutCookieHeaders = (input: BffInput) => {
  const domainPrefix = getCookieDomainPrefix(input);
  const cookies = parseCookies(readHeader(input, 'cookie'));
  const csrfToken = cookies[CSRF_COOKIE_NAME] || createCsrfToken();
  const headers = new Headers();

  headers.append(
    'Set-Cookie',
    `mf_sso_token=; ${buildCookieAttrs(domainPrefix, 0, true)}`,
  );
  headers.append(
    'Set-Cookie',
    `mf_sso_user=; ${buildCookieAttrs(domainPrefix, 0, true)}`,
  );
  headers.append('Set-Cookie', buildCsrfCookie(csrfToken, domainPrefix));

  return headers;
};

export type { BffInput };
