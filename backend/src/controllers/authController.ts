import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export class AuthController {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    });

    try {
      const data = schema.parse(request.body);
      await authService.register(data);
      return reply.status(201).send();
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    try {
      const data = schema.parse(request.body);
      const user = await authService.authenticate(data);
      return reply.status(200).send({ user });
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  }

  async forgotPassword(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({ email: z.email() });

    try {
      const { email } = schema.parse(request.body);
      const token = await authService.generateRecoveryToken(email);

      if (token) {
        console.log(`[EMAIL SIMULATION] Token para ${email}: ${token}`);
      }

      return reply.status(200).send({ 
        message: 'Se o e-mail existir, um link de recuperação será enviado.' 
      });
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  }

  async resetPassword(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      token: z.string(),
      newPassword: z.string().min(6),
    });

    try {
      const { token, newPassword } = schema.parse(request.body);
      await authService.resetPassword(token, newPassword);
      return reply.status(200).send({ message: 'Senha atualizada com sucesso!' });
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  }
}