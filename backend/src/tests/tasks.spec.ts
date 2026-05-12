import { expect, test, describe, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { app } from '../server';

describe('Tasks API', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('should be able to list tasks', async () => {
    const response = await supertest(app.server).get('/tasks');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('should be able to create a new task', async () => {
    const response = await supertest(app.server)
      .post('/tasks')
      .send({
        title: 'Teste',
        description: 'Validando testes'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});