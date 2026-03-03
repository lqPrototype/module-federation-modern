import {
  buildSessionCookieHeaders,
  createJsonResponse,
  createNoContentResponse,
  parseCookies,
} from './_common';
import type { BffInput } from './_common';

export const GET = (input: BffInput) => {
  const cookies = parseCookies(input.headers?.cookie || '');
  const loggedIn = Boolean(cookies.mf_sso_token);

  return createJsonResponse(
    input,
    {
      loggedIn,
      user: cookies.mf_sso_user || null,
    },
    200,
    buildSessionCookieHeaders(input),
  );
};

export const OPTIONS = (input: BffInput) => {
  return createNoContentResponse(input);
};
