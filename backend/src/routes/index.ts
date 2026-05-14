import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { TaskController } from '../controllers/taskController';
import { AuthController } from '../controllers/authController';
import { taskSchemas, authSchemas } from '../docs/schemas';

const taskController = new TaskController();
const authController = new AuthController();

async function taskRoutesInternal(app: FastifyInstance) {
  // --- Auth Routes ---
  app.post('/users', { schema: authSchemas.register }, authController.register);
  app.post('/sessions', { schema: authSchemas.login }, authController.login);

  // --- Task Routes ---
  app.get('/tasks', { schema: taskSchemas.listTasks }, taskController.list);
  
  app.get('/tasks/:id', { 
    schema: { tags: ['Tasks'], summary: 'Buscar tarefa por ID' } 
  }, taskController.getById);

  app.post('/tasks', { schema: taskSchemas.createTask }, taskController.create);

  app.patch('/tasks/:id', { 
    schema: { tags: ['Tasks'], summary: 'Atualizar tarefa' } 
  }, taskController.update);

  app.delete('/tasks/:id', { 
    schema: { tags: ['Tasks'], summary: 'Excluir tarefa' } 
  }, taskController.delete);
}

export const taskRoutes = fp(taskRoutesInternal);