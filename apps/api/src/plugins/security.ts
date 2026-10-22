import { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifySensible from '@fastify/sensible';
import { EnvConfig } from '../config/env';

export async function registerSecurityPlugins(app: FastifyInstance, config: EnvConfig) {
  // Headers de Segurança HTTP
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: config.NODE_ENV === 'production',
    crossOriginEmbedderPolicy: false
  });

  // CORS Restritivo
  const allowedOrigins = config.CORS_ORIGIN.split(',').map((o) => o.trim());

  await app.register(fastifyCors, {
    origin: (origin, cb) => {
      // Permitir requisições sem origin (como testes unitários ou curl/postman)
      if (!origin) {
        return cb(null, true);
      }
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return cb(null, true);
      }
      return cb(new Error('Origem não permitida pela política de CORS do SIGEA'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  });

  // Utilitários de Resposta HTTP do Fastify
  await app.register(fastifySensible);

  // Hook para adicionar cabeçalho x-request-id nas respostas
  app.addHook('onSend', async (request, reply) => {
    reply.header('x-request-id', request.id);
  });
}
