import { prisma } from '../lib/prisma';

export interface CreateTaskDTO {
  title: string;
  description?: string;
  isPriority?: boolean;
  userId: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
  isDoing?: boolean;
  isPriority?: boolean;
}

export class TaskService {
  async listByUser(userId: string) {
    return await prisma.task.findMany({
      where: { userId }, // Segurança: lista apenas as tarefas do dono
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(data: CreateTaskDTO) {
    return await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        isPriority: data.isPriority,
        userId: data.userId // Vincula ao usuário logado
      }
    });
  }

  async update(id: string, userId: string, data: UpdateTaskDTO) {
    // Verificamos se a tarefa existe e pertence ao usuário antes de atualizar
    return await prisma.task.update({
      where: { id, userId },
      data,
    });
  }

  async delete(id: string, userId: string) {
    // Garante que o usuário só delete o que é dele
    return await prisma.task.delete({
      where: { id, userId }
    });
  }
}