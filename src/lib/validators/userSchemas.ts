import { z } from 'zod';

export const CreateUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
  role: z.enum(['ADMIN', 'USER']).optional().default('USER'),
  active: z.boolean().optional().default(true),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(['ADMIN', 'USER']).optional(),
  active: z.boolean().optional(),
});

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;

export const UpdatePasswordSchema = z.object({
  password: z.string().min(8),
});
export type UpdatePasswordDTO = z.infer<typeof UpdatePasswordSchema>;
