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

// 1. Garanta que a porta seja um número, usando um fallback seguro (ex: 3333)
const PORT = Number(process.env.PORT) || 3333;

const start = async () => {
  try {
    // 2. Passe a porta e o host dentro do objeto esperado pelo Fastify
    await app.listen({ 
      port: PORT, 
      host: '0.0.0.0' // Importante para o deploy (Render/Railway) funcionar!
    });
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();