import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export const userRepository = {
  async list() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, username: true, name: true, role: true, active: true, createdAt: true, updatedAt: true },
    });
  },

  async getById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  },

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },
};
