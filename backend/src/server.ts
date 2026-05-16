import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { taskRoutes } from './routes';

export const app = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      strict: false, 
      allErrors: true,
    }
  }
});

await app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization']
});


await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'FocusFlow API',
      description: 'Documentação da API de gerenciamento de tarefas',
      version: '1.0.0',
    },
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
});

const PORT = Number(process.env.PORT) || 3333;

const start = async () => {
  try {
    await app.listen({ 
      port: PORT, 
      host: '0.0.0.0'
    });
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();