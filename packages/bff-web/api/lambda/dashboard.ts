import { createJsonResponse, createNoContentResponse, parseCookies } from './_common';
import type { BffInput } from './_common';

export const GET = (input: BffInput) => {
  const cookies = parseCookies(input.headers?.cookie || '');
  if (!cookies.mf_sso_token) {
    return createJsonResponse(
      input,
      { success: false, message: 'Unauthorized' },
      401,
    );
  }

  return createJsonResponse(input, {
    success: true,
    data: {
      product: {
        total: 1280,
        online: 1216,
      },
      recommendation: {
        hitRate: 0.237,
        strategyCount: 14,
      },
      catalog: {
        categories: 86,
        pendingReview: 12,
      },
      comment: {
        totalToday: 3491,
        pendingModeration: 34,
      },
    },
  });
};

export const OPTIONS = (input: BffInput) => {
  return createNoContentResponse(input);
};
