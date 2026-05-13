import { FastifyInstance } from 'fastify';
import { TaskController } from '../controllers/taskController';

const taskController = new TaskController();

export async function taskRoutes(app: FastifyInstance) {
  app.get('/tasks', taskController.list);
  app.post('/tasks', taskController.create);
  app.patch('/tasks/:id', taskController.update);
  app.delete('/tasks/:id', taskController.delete);
}