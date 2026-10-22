import { buildApp } from './app';
import { env } from './config/env';

async function startServer() {
  try {
    const app = await buildApp(env);

    await app.listen({
      port: env.PORT,
      host: env.HOST
    });

    app.log.info(
      `SIGEA Backend API operacional em http://${env.HOST}:${env.PORT}/api/v1 [Ambiente: ${env.NODE_ENV}]`
    );

    // Encerramento Gracioso (Graceful Shutdown)
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        app.log.info(`Sinal ${signal} recebido. A encerrar servidor graciosamente...`);
        try {
          await app.close();
          app.log.info('Servidor encerrado com sucesso.');
          process.exit(0);
        } catch (err) {
          app.log.error({ err }, 'Erro ao encerrar servidor Fastify');
          process.exit(1);
        }
      });
    });
  } catch (err) {
    console.error('Falha crítica ao iniciar o servidor SIGEA:', err);
    process.exit(1);
  }
}

startServer();
