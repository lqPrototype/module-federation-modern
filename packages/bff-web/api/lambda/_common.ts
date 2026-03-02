type BffInput = {
  headers?: Record<string, string | undefined>;
  data?: Record<string, unknown>;
  body?: Record<string, unknown>;
};

const ALLOWED_ORIGINS = new Set([
  'http://localhost:8080',
  'http://localhost:3053',
  'http://localhost:8081',
  'http://localhost:8088',
  'http://host.mf.local:8080',
  'http://remote.mf.local:3053',
  'http://auth.mf.local:8081',
  'http://showcase.mf.local:8088',
]);

const readOrigin = (input: BffInput) => input.headers?.origin || '';

const buildCorsHeaders = (origin: string) => {
  const headers = new Headers();
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Vary', 'Origin');
  }

  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
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
  const origin = readOrigin(input);
  const host = input.headers?.host || '';
  if (isMfDomainRequest(origin, host)) {
    return 'Domain=.mf.local; ';
  }
  return '';
};

export const buildLoginCookieHeaders = (input: BffInput, username: string) => {
  const domainPrefix = getCookieDomainPrefix(input);
  const headers = new Headers();

  headers.append(
    'Set-Cookie',
    `mf_sso_token=demo-token; ${domainPrefix}Path=/; Max-Age=86400; HttpOnly; SameSite=Lax`,
  );
  headers.append(
    'Set-Cookie',
    `mf_sso_user=${encodeURIComponent(username)}; ${domainPrefix}Path=/; Max-Age=86400; SameSite=Lax`,
  );

  return headers;
};

export const buildLogoutCookieHeaders = (input: BffInput) => {
  const domainPrefix = getCookieDomainPrefix(input);
  const headers = new Headers();

  headers.append(
    'Set-Cookie',
    `mf_sso_token=; ${domainPrefix}Path=/; Max-Age=0; HttpOnly; SameSite=Lax`,
  );
  headers.append(
    'Set-Cookie',
    `mf_sso_user=; ${domainPrefix}Path=/; Max-Age=0; SameSite=Lax`,
  );

  return headers;
};

export type { BffInput };
