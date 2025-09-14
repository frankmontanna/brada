import type { SessionUser } from '@/lib/auth/sessionUser';
import { HttpError } from '@/lib/errors';
import type { CreateUserDTO, UpdatePasswordDTO, UpdateUserDTO } from '@/lib/validators/userSchemas';
import { userRepository } from '@/repositories/userRepository';
import bcrypt from 'bcryptjs';

export const userService = {
  async listUsers(_: SessionUser) {
    return userRepository.list();
  },

  async createUser(requester: SessionUser, dto: CreateUserDTO) {
    if (requester.role !== 'ADMIN') throw new HttpError(403, 'Apenas administradores podem criar usuários');

    const hashed = await bcrypt.hash(dto.password, 10);
    try {
      const user = await userRepository.create({
        username: dto.username,
        password: hashed,
        name: dto.name,
        role: dto.role ?? 'USER',
        active: dto.active ?? true,
      });
      const { password, ...safe } = user;
      return safe;
    } catch (e: any) {
      if (e?.code === 'P2002') throw new HttpError(409, 'Username já está em uso');
      throw e;
    }
  },

  async updateUser(requester: SessionUser, id: string, dto: UpdateUserDTO) {
    const isSelf = requester.id === id;
    const isAdmin = requester.role === 'ADMIN';

    if (!isAdmin && !isSelf) {
      throw new HttpError(403, 'Sem permissão para alterar este usuário');
    }

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (isAdmin) {
      if (dto.role !== undefined) data.role = dto.role;
      if (dto.active !== undefined) data.active = dto.active;
    }

    if (Object.keys(data).length === 0) {
      throw new HttpError(400, 'Nada para atualizar');
    }

    const user = await userRepository.update(id, data);
    const { password, ...safe } = user;
    return safe;
  },

  async updatePassword(requester: SessionUser, id: string, dto: UpdatePasswordDTO) {
    const isSelf = requester.id === id;
    const isAdmin = requester.role === 'ADMIN';
    if (!isSelf && !isAdmin) {
      throw new HttpError(403, 'Sem permissão para alterar a senha deste usuário');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    await userRepository.update(id, { password: hashed });
    return { ok: true };
  },

  async deleteUser(requester: SessionUser, id: string) {
    if (requester.role !== 'ADMIN') throw new HttpError(403, 'Apenas administradores podem deletar usuários');
    if (requester.id === id) throw new HttpError(400, 'Você não pode deletar seu próprio usuário');

    await userRepository.delete(id);
    return { ok: true };
  },
};
