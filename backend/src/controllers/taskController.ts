import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { TaskService } from '../services/taskService';

const taskService = new TaskService();

export class TaskController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const querySchema = z.object({ userId: z.uuid() });
    
    try {
      const { userId } = querySchema.parse(request.query);
      const tasks = await taskService.listByUser(userId);
      return reply.status(200).send(tasks);
    } catch (error) {
      return reply.status(400).send({ message: "UserId inválido ou ausente." });
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const createSchema = z.object({
      title: z.string(),
      description: z.string().optional(),
      isPriority: z.boolean().optional().default(false), 
      userId: z.uuid()
    });

    try {
      const data = createSchema.parse(request.body);
      const task = await taskService.create(data);
      return reply.status(201).send(task);
    } catch (error) {
      return reply.status(400).send(error);
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const bodySchema = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      completed: z.boolean().optional(),
      isDoing: z.boolean().optional(),
      isPriority: z.boolean().optional(),
      userId: z.uuid() // Necessário para validar o dono
    });

    try {
      const { id } = paramsSchema.parse(request.params);
      const { userId, ...data } = bodySchema.parse(request.body);
      
      const task = await taskService.update(id, userId, data);
      return reply.status(200).send(task);
    } catch (error) {
      return reply.status(400).send({ message: "Erro ao atualizar ou permissão negada." });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({ id: z.string().uuid() });
    const querySchema = z.object({ userId: z.uuid() });

    try {
      const { id } = paramsSchema.parse(request.params);
      const { userId } = querySchema.parse(request.query);

      await taskService.delete(id, userId);
      return reply.status(204).send();
    } catch (error) {
      return reply.status(400).send({ message: "Erro ao excluir ou permissão negada." });
    }
  }
}