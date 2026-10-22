import fastify, { FastifyInstance } from 'fastify';
import { EnvConfig, loadEnv } from './config/env';
import { registerSecurityPlugins } from './plugins/security';
import { errorHandler, NotFoundError } from './utils/errors';
import { v1Routes } from './routes/v1';

export async function buildApp(customConfig?: EnvConfig): Promise<FastifyInstance> {
  const config = customConfig || loadEnv();

  const app = fastify({
    logger: {
      level: config.LOG_LEVEL,
      serializers: {
        req(req) {
          return {
            method: req.method,
            url: req.url,
            hostname: req.hostname,
            remoteAddress: req.ip
          };
        }
      }
    },
    disableRequestLogging: config.NODE_ENV === 'test',
    bodyLimit: 1048576 // 1MB limite seguro
  });

  // Registar Plugins Transversais de Segurança
  await registerSecurityPlugins(app, config);

  // Tratamento Centralizado de Erros
  app.setErrorHandler(errorHandler);

  // Rota 404 Padronizada
  app.setNotFoundHandler((request, _reply) => {
    throw new NotFoundError(`Endpoint '${request.method} ${request.url}' não encontrado`);
  });

  // Registar Rotas /api/v1
  await app.register(v1Routes, { prefix: '/api/v1', config });

  return app;
}
