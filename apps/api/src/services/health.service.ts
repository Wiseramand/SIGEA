import { EnvConfig } from '../config/env';
import { HealthResponse, ReadyResponse } from '../schemas/health.schema';

const startTime = Date.now();

export class HealthService {
  constructor(private readonly config: EnvConfig) {}

  public getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'sigea-api',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
      environment: this.config.NODE_ENV
    };
  }

  public async getReadiness(): Promise<ReadyResponse> {
    // Verificação de integridade da configuração
    const configOk = Boolean(this.config.PORT && this.config.HOST);

    // Na Fase 01, como a base de dados ainda não tem migrações aplicadas,
    // marcamos a verificação de base de dados como 'skipped_dev' ou 'ok' se houver URL válida.
    const hasDbUrl = Boolean(this.config.DATABASE_URL && this.config.DATABASE_URL.length > 0);
    const dbStatus = hasDbUrl ? 'skipped_dev' : 'unavailable';

    const isReady = configOk && dbStatus !== 'unavailable';

    return {
      status: isReady ? 'ready' : 'not_ready',
      service: 'sigea-api',
      timestamp: new Date().toISOString(),
      checks: {
        configuration: configOk ? 'ok' : 'failed',
        database: dbStatus
      }
    };
  }
}
