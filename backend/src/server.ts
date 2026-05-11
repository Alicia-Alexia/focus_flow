import Fastify from 'fastify';
import  { prisma }  from './lib/prisma';
import { z } from 'zod';

const fastify = Fastify({ logger: true });

// GET: Listar todas
fastify.get('/tasks', async () => {
  return await prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
});

// POST: Criar tarefa
fastify.post('/tasks', async (request, reply) => {
  const createTaskSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
  });
  const { title, description } = createTaskSchema.parse(request.body);
  const task = await prisma.task.create({ data: { title, description } });
  return reply.status(201).send(task);
});

// PATCH: Atualizar status/dados
fastify.patch('/tasks/:id', async (request) => {
  const { id } = request.params as { id: string };
  const updateSchema = z.object({
    completed: z.boolean().optional(),
    title: z.string().optional(),
  });
  const data = updateSchema.parse(request.body);
  return await prisma.task.update({ where: { id }, data });
});

// DELETE: Remover
fastify.delete('/tasks/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  await prisma.task.delete({ where: { id } });
  return reply.status(204).send();
});

fastify.listen({ port: 3333 });