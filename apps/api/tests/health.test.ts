import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app';
import { loadEnv } from '../src/config/env';

describe('Endpoints de Infraestrutura (/api/v1/health e /api/v1/ready)', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    const testConfig = loadEnv({
      NODE_ENV: 'test',
      PORT: 4001,
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

  it('GET /api/v1/health deve responder 200 com informações de integridade', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/health'
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('ok');
    expect(body.data.service).toBe('sigea-api');
    expect(body.data.version).toBe('0.1.0');
    expect(body.data.environment).toBe('test');
    expect(typeof body.data.uptimeSeconds).toBe('number');
    expect(typeof body.data.timestamp).toBe('string');

    // Verificar cabeçalho de correlação de pedido
    expect(response.headers['x-request-id']).toBeDefined();
  });

  it('GET /api/v1/ready deve responder 200 quando os checks essenciais estão válidos', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/ready'
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('ready');
    expect(body.data.checks.configuration).toBe('ok');
    expect(body.data.checks.database).toBe('skipped_dev');
  });

  it('Não deve expor credenciais ou connection strings nos endpoints de health', async () => {
    const responseHealth = await app.inject({ method: 'GET', url: '/api/v1/health' });
    const responseReady = await app.inject({ method: 'GET', url: '/api/v1/ready' });

    expect(responseHealth.body).not.toContain('postgresql://');
    expect(responseHealth.body).not.toContain('postgres');
    expect(responseReady.body).not.toContain('postgresql://');
    expect(responseReady.body).not.toContain('postgres');
  });
});
