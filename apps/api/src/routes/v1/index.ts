import { FastifyInstance } from 'fastify';
import { healthRoutes } from './health.routes';
import { EnvConfig } from '../../config/env';

export async function v1Routes(app: FastifyInstance, options: { config: EnvConfig }) {
  // Rotas de Infraestrutura
  await app.register(healthRoutes, { config: options.config });
}
