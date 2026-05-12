import Fastify from 'fastify';
import cors from '@fastify/cors';
import { prisma } from './lib/prisma';
import { z } from 'zod';

export const app = Fastify({ logger: true });

await app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
});

app.get('/tasks', async () => {
  return await prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
});

app.post('/tasks', async (request, reply) => {
  const createTaskSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
  });
  
  const { title, description } = createTaskSchema.parse(request.body);
  const task = await prisma.task.create({ data: { title, description } });
  return reply.status(201).send(task);
});

// backend/src/server.ts
app.patch('/tasks/:id', async (request) => {
  const { id } = request.params as { id: string };
  
  const updateSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
  });

  const data = updateSchema.parse(request.body);

  return await prisma.task.update({
    where: { id },
    data, 
  });
});

app.delete('/tasks/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  await prisma.task.delete({ where: { id } });
  return reply.status(204).send();
});

if (process.env.NODE_ENV !== 'test') {
  app.listen({ port: 3333 }).catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
}