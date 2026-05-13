import Fastify from 'fastify';
import cors from '@fastify/cors';
import { taskRoutes } from './routes/taskRoutes';
export const app = Fastify({ logger: true });

await app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
});

app.register(taskRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen({ port: 3333 }).catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
}