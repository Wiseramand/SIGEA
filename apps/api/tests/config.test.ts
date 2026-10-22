import { describe, it, expect } from 'vitest';
import { loadEnv } from '../src/config/env';

describe('Validação de Configuração de Ambiente com Zod', () => {
  it('Deve aceitar configurações válidas e aplicar defaults adequados', () => {
    const validConfig = loadEnv({
      PORT: 5000,
      HOST: '127.0.0.1',
      NODE_ENV: 'test',
      APP_URL: 'http://localhost:3000'
    });

    expect(validConfig.PORT).toBe(5000);
    expect(validConfig.HOST).toBe('127.0.0.1');
    expect(validConfig.NODE_ENV).toBe('test');
    expect(validConfig.CORS_ORIGIN).toBeDefined();
    expect(validConfig.LOG_LEVEL).toBe('info');
  });

  it('Deve rejeitar configurações inválidas com mensagens explícitas', () => {
    expect(() => {
      loadEnv({
        NODE_ENV: 'ambiente_invalido' as any
      });
    }).toThrow('Falha na validação de variáveis de ambiente');
  });
});
