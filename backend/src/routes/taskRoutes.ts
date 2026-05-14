import { FastifyInstance } from 'fastify';
import { TaskController } from '../controllers/taskController';
import { AuthController } from '../controllers/authController';

const taskController = new TaskController();
const authController = new AuthController();

export async function taskRoutes(app: FastifyInstance) {
  app.post('/users', authController.register);
  app.post('/sessions', authController.login);
  app.get('/tasks', taskController.list);
  app.get('/tasks/:id', taskController.getById)
  app.post('/tasks', taskController.create);
  app.patch('/tasks/:id', taskController.update);
  app.delete('/tasks/:id', taskController.delete);
}