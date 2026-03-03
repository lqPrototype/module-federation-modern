import {
  buildLoginCookieHeaders,
  createJsonResponse,
  createNoContentResponse,
  validateCsrf,
} from './_common';
import type { BffInput } from './_common';

export const POST = (input: BffInput) => {
  if (!validateCsrf(input)) {
    return createJsonResponse(input, { success: false, message: 'CSRF validation failed' }, 403);
  }

  const body = (input.data || input.body || {}) as Record<string, unknown>;
  const username = String(body.username || 'admin');

  return createJsonResponse(
    input,
    {
      success: true,
      token: 'demo-token',
      user: {
        id: 1,
        username,
      },
    },
    200,
    buildLoginCookieHeaders(input, username),
  );
};

export const OPTIONS = (input: BffInput) => {
  return createNoContentResponse(input);
};
