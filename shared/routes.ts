import { z } from 'zod';
import { insertUserSchema, insertFarmSchema, insertListingSchema, loginSchema, users, farms, listings } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const listingWithFarmerSchema = z.object({
  listing: z.custom<typeof listings.$inferSelect>(),
  farmer: z.custom<typeof users.$inferSelect>(),
  farm: z.custom<typeof farms.$inferSelect>().optional(),
});

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/auth/register' as const,
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: loginSchema,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout' as const,
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  farms: {
    create: {
      method: 'POST' as const,
      path: '/api/farms' as const,
      input: insertFarmSchema,
      responses: {
        201: z.custom<typeof farms.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    getMine: {
      method: 'GET' as const,
      path: '/api/farms/me' as const,
      responses: {
        200: z.custom<typeof farms.$inferSelect>(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    }
  },
  listings: {
    create: {
      method: 'POST' as const,
      path: '/api/listings' as const,
      input: insertListingSchema,
      responses: {
        201: z.custom<typeof listings.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/listings' as const,
      input: z.object({
        search: z.string().optional(),
        category: z.string().optional(),
        state: z.string().optional(),
        minPrice: z.string().optional(),
        maxPrice: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(listingWithFarmerSchema),
      },
    },
    getMine: {
      method: 'GET' as const,
      path: '/api/listings/me' as const,
      responses: {
        200: z.array(z.custom<typeof listings.$inferSelect>()),
        401: errorSchemas.unauthorized,
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/listings/:id' as const,
      responses: {
        200: listingWithFarmerSchema,
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/listings/:id' as const,
      input: insertListingSchema.partial().extend({
        status: z.string().optional(),
      }),
      responses: {
        200: z.custom<typeof listings.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/listings/:id' as const,
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    recordView: {
      method: 'POST' as const,
      path: '/api/listings/:id/view' as const,
      responses: {
        200: z.object({ views: z.number() }),
      }
    }
  },
  analytics: {
    trendingCrops: {
      method: 'GET' as const,
      path: '/api/analytics/trending-crops' as const,
      responses: {
        200: z.array(z.object({ cropName: z.string(), count: z.number() })),
      },
    },
    priceInsights: {
      method: 'GET' as const,
      path: '/api/analytics/price-insights' as const,
      input: z.object({ cropName: z.string() }).optional(),
      responses: {
        200: z.object({ averagePrice: z.number(), minPrice: z.number(), maxPrice: z.number() }),
      },
    },
  },
  admin: {
    users: {
      method: 'GET' as const,
      path: '/api/admin/users' as const,
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    verifyFarmer: {
      method: 'POST' as const,
      path: '/api/admin/users/:id/verify' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    stats: {
      method: 'GET' as const,
      path: '/api/admin/stats' as const,
      responses: {
        200: z.object({ totalCropsPerState: z.record(z.string(), z.number()) }),
        401: errorSchemas.unauthorized,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}