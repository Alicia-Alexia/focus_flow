import { prisma } from '../lib/prisma';
import { hash, compare } from 'bcrypt-ts';
import { randomBytes } from 'node:crypto';

export class AuthService {
  async register({ name, email, password }: any) {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) throw new Error('E-mail já cadastrado.');

    const passwordHash = await hash(password, 8);

    return await prisma.user.create({
      data: { name, email, password: passwordHash }
    });
  }

  async authenticate({ email, password }: any) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Credenciais inválidas.');

    const passwordMatches = await compare(password, user.password);
    if (!passwordMatches) throw new Error('Credenciais inválidas.');

    return { id: user.id, name: user.name };
  }

  async generateRecoveryToken(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null; 

    const token = randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 3600000); 

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        resetToken: token, 
        resetExpires: expires 
      }
    });

    return token;
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetExpires: { gt: new Date() } 
      }
    });

    if (!user) throw new Error('Token inválido ou expirado.');

    const passwordHash = await hash(newPassword, 8);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: passwordHash,
        resetToken: null,
        resetExpires: null
      }
    });
  }
}