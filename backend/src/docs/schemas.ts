export const taskSchemas = {
  createTask: {
    tags: ['Tasks'],
    summary: 'Criar uma nova tarefa',
    body: {
      type: 'object',
      required: ['title', 'userId'],
      properties: {
        title: { type: 'string', examples: ['Estudar TypeScript'] },
        description: { type: 'string', examples: ['Seguir os princípios de Clean Code'] },
        isPriority: { type: 'boolean', default: false },
        userId: { type: 'string', format: 'uuid' }
      }
    },
    response: {
      201: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string' },
          isPriority: { type: 'boolean' },
          userId: { type: 'string' }
        }
      }
    }
  },
  listTasks: {
    tags: ['Tasks'],
    summary: 'Listar todas as tarefas do usuário',
    querystring: {
      type: 'object',
      required: ['userId'],
      properties: {
        userId: { type: 'string', format: 'uuid' }
      }
    }
  }
};

export const authSchemas = {
  login: {
    tags: ['Auth'],
    summary: 'Realizar login',
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' }
      }
    }
  },
  register: {
    tags: ['Auth'],
    summary: 'Cadastrar novo usuário',
    body: {
      type: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        password: { type: 'string' }
      }
    }
  }
};