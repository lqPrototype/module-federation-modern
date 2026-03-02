import { buildLoginCookieHeaders, createJsonResponse, createNoContentResponse } from './_common';
import type { BffInput } from './_common';

export const POST = (input: BffInput) => {
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
