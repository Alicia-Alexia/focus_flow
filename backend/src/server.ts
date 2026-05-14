import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { taskRoutes } from './routes';

export const app = Fastify({
  logger: true,
  // Adicione isso aqui:
  ajv: {
    customOptions: {
      strict: false, // Isso impede o erro de "unknown keyword"
      allErrors: true,
    }
  }
});

await app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
});


await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'FocusFlow API',
      description: 'Documentação da API de gerenciamento de tarefas',
      version: '1.0.0',
    },
    // Adicione os servidores para evitar erros de CORS no Swagger
    servers: [
      { url: 'http://localhost:3333' }
    ],
  },
});
await app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

await app.register(taskRoutes);

app.ready().then(() => {
  console.log('✅ Swagger carregado com sucesso!');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen({ port: 3333 }).catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
}