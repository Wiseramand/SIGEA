import { z } from 'zod';
import dotenv from 'dotenv';

// Carregar .env se existir
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  APP_URL: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z.string().optional().default('postgresql://postgres:postgres@localhost:5432/sigea_dev?schema=public'),
  CORS_ORIGIN: z.string().default('http://localhost:3000,http://127.0.0.1:3000'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info')
});

export type EnvConfig = z.infer<typeof envSchema>;

let cachedEnv: EnvConfig | null = null;

export function loadEnv(customEnv?: Record<string, unknown>): EnvConfig {
  if (customEnv) {
    const parsed = envSchema.safeParse(customEnv);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new Error(`Falha na validação de variáveis de ambiente: ${errorMsg}`);
    }
    return parsed.data;
  }

  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');
    throw new Error(`Falha na validação de variáveis de ambiente: ${errorMsg}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

export const env = loadEnv();
