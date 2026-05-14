import { expect, test, describe, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { app } from '../server';
import { prisma } from '../lib/prisma'; 

describe('Tasks API', () => {
  let userId: string;

  beforeAll(async () => {
  await app.ready();
  
  const response = await supertest(app.server)
    .post('/users')
    .send({
      name: 'QA Tester',
      email: 'qa@test.com',
      password: 'password123'
    });

  if (response.status === 201) {
    userId = response.body.id; 
  } else {
    const user = await prisma.user.findUnique({ where: { email: 'qa@test.com' } });
    userId = user!.id;
  }
});

  afterAll(async () => {
    await app.close();
  });

  test('should be able to list tasks', async () => {
    const response = await supertest(app.server)
      .get(`/tasks?userId=${userId}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('should be able to create a new task', async () => {
    const response = await supertest(app.server)
      .post('/tasks')
      .send({
        title: 'Teste de QA',
        description: 'Validando integração com userId',
        userId: userId 
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.userId).toBe(userId);
  });

  test('should be able to get a specific task by id', async () => {
    const createRes = await supertest(app.server)
      .post('/tasks')
      .send({ title: 'Task Unica', userId });

    const taskId = createRes.body.id;

    const response = await supertest(app.server)
      .get(`/tasks/${taskId}?userId=${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Task Unica');
  });
});