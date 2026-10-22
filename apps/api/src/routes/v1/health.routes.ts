import { FastifyInstance } from 'fastify';
import { HealthService } from '../../services/health.service';
import { EnvConfig } from '../../config/env';

export async function healthRoutes(app: FastifyInstance, options: { config: EnvConfig }) {
  const healthService = new HealthService(options.config);

  // GET /api/v1/health — Verificação básica de vida da aplicação
  app.get('/health', async (_request, reply) => {
    const health = healthService.getHealth();
    return reply.status(200).send({
      success: true,
      data: health
    });
  });

  // GET /api/v1/ready — Verificação de prontidão para receber tráfego
  app.get('/ready', async (_request, reply) => {
    const readiness = await healthService.getReadiness();
    const statusCode = readiness.status === 'ready' ? 200 : 503;
    return reply.status(statusCode).send({
      success: readiness.status === 'ready',
      data: readiness
    });
  });
}
