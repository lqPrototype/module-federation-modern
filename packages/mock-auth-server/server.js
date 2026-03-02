const http = require('node:http');

const PORT = 4000;

const json = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
  });
  res.end(JSON.stringify(data));
};

const parseBody = req =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) {
        reject(new Error('Body too large'));
      }
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
  });

const parseCookies = cookieHeader => {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(';').reduce((acc, pair) => {
    const index = pair.indexOf('=');
    const key = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();
    if (key) {
      acc[key] = decodeURIComponent(value);
    }
    return acc;
  }, {});
};

const isMfDomainRequest = (origin, host) => {
  const target = `${origin || ''} ${host || ''}`;
  return target.includes('.mf.local');
};

const applyCors = (req, res) => {
  const origin = req.headers.origin;
  const allowList = new Set([
    'http://localhost:8080',
    'http://localhost:3053',
    'http://localhost:8081',
    'http://localhost:8088',
    'http://host.mf.local:8080',
    'http://remote.mf.local:3053',
    'http://auth.mf.local:8081',
    'http://showcase.mf.local:8088',
  ]);

  if (origin && allowList.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
};

const buildSessionCookie = req => {
  const origin = req.headers.origin || '';
  const host = req.headers.host || '';
  const cookieDomain = isMfDomainRequest(origin, host) ? 'Domain=.mf.local; ' : '';
  return `mf_sso_token=demo-token; ${cookieDomain}Path=/; Max-Age=86400; SameSite=Lax`;
};

const buildUserCookie = (req, username) => {
  const origin = req.headers.origin || '';
  const host = req.headers.host || '';
  const cookieDomain = isMfDomainRequest(origin, host) ? 'Domain=.mf.local; ' : '';
  return `mf_sso_user=${encodeURIComponent(username)}; ${cookieDomain}Path=/; Max-Age=86400; SameSite=Lax`;
};

const clearSessionCookie = req => {
  const origin = req.headers.origin || '';
  const host = req.headers.host || '';
  const cookieDomain = isMfDomainRequest(origin, host) ? 'Domain=.mf.local; ' : '';
  return `mf_sso_token=; ${cookieDomain}Path=/; Max-Age=0; SameSite=Lax`;
};

const server = http.createServer(async (req, res) => {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/api/session' && req.method === 'GET') {
    const cookies = parseCookies(req.headers.cookie);
    json(res, 200, {
      loggedIn: Boolean(cookies.mf_sso_token),
      user: cookies.mf_sso_user || null,
    });
    return;
  }

  if (req.url === '/api/login' && req.method === 'POST') {
    try {
      const payload = await parseBody(req);
      const username = payload.username || 'admin';

      res.setHeader('Set-Cookie', [
        buildSessionCookie(req),
        buildUserCookie(req, username),
      ]);

      json(res, 200, {
        success: true,
        token: 'demo-token',
        user: {
          id: 1,
          username,
        },
      });
    } catch (error) {
      json(res, 400, {
        success: false,
        message: error.message,
      });
    }
    return;
  }

  if (req.url === '/api/logout' && req.method === 'POST') {
    res.setHeader('Set-Cookie', [clearSessionCookie(req)]);
    json(res, 200, { success: true });
    return;
  }

  json(res, 404, { success: false, message: 'Not Found' });
});

server.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`[mock-auth-server] listening on http://localhost:${PORT}`);
});
