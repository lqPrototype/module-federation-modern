import {
  buildLogoutCookieHeaders,
  createJsonResponse,
  createNoContentResponse,
  validateCsrf,
} from './_common';
import type { BffInput } from './_common';

export const POST = (input: BffInput) => {
  if (!validateCsrf(input)) {
    return createJsonResponse(input, { success: false, message: 'CSRF validation failed' }, 403);
  }

  return createJsonResponse(input, { success: true }, 200, buildLogoutCookieHeaders(input));
};

export const OPTIONS = (input: BffInput) => {
  return createNoContentResponse(input);
};
