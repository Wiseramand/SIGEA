import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app';
import { loadEnv } from '../src/config/env';

describe('Tratamento Centralizado de Erros', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    const testConfig = loadEnv({
      NODE_ENV: 'test',
      PORT: 4002,
      HOST: '127.0.0.1',
      APP_URL: 'http://localhost:3000',
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/test?schema=public',
      CORS_ORIGIN: 'http://localhost:3000',
      LOG_LEVEL: 'silent'
    });
    app = await buildApp(testConfig);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Requisição a rota inexistente deve retornar 404 padronizado', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/rota-que-nao-existe'
    });

    expect(response.statusCode).toBe(404);

    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('NOT_FOUND');
    expect(body.error.message).toContain('não encontrado');
    expect(body.error.requestId).toBeDefined();
  });
});
