import {
  buildLogoutCookieHeaders,
  createJsonResponse,
  createNoContentResponse,
} from './_common';
import type { BffInput } from './_common';

export const POST = (input: BffInput) => {
  return createJsonResponse(input, { success: true }, 200, buildLogoutCookieHeaders(input));
};

export const OPTIONS = (input: BffInput) => {
  return createNoContentResponse(input);
};
