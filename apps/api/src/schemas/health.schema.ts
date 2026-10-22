import { z } from 'zod';

export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  service: z.literal('sigea-api'),
  version: z.string(),
  timestamp: z.string().datetime(),
  uptimeSeconds: z.number().nonnegative(),
  environment: z.enum(['development', 'test', 'production'])
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const readyResponseSchema = z.object({
  status: z.enum(['ready', 'not_ready']),
  service: z.literal('sigea-api'),
  timestamp: z.string().datetime(),
  checks: z.object({
    configuration: z.enum(['ok', 'failed']),
    database: z.enum(['ok', 'unavailable', 'skipped_dev'])
  })
});

export type ReadyResponse = z.infer<typeof readyResponseSchema>;
