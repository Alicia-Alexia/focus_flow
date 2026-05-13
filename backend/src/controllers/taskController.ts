import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export class TaskController {
  async list(request: FastifyRequest) {
    return await prisma.task.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const createSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  isPriority: z.boolean().optional().default(false), // Garante o tratamento do booleano
});

    const { title, description, isPriority } = createSchema.parse(request.body);

    const task = await prisma.task.create({
      data: { title, description, isPriority}
    });

    return reply.status(201).send(task);
  }

  async update(request: FastifyRequest) {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const updateSchema = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      completed: z.boolean().optional(),
      isDoing: z.boolean().optional(),
      isPriority: z.boolean().optional(),
    });

    const { id } = paramsSchema.parse(request.params);
    const data = updateSchema.parse(request.body);

    return await prisma.task.update({
      where: { id },
      data,
    });
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const { id } = paramsSchema.parse(request.params);

    await prisma.task.delete({ where: { id } });
    return reply.status(204).send();
  }
}