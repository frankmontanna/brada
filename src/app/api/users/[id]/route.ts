import { getSessionUserFromHeader } from '@/lib/auth/sessionUser';
import { handleRouteError, json } from '@/lib/http';
import { UpdateUserSchema } from '@/lib/validators/userSchemas';
import { userService } from '@/services/userService';
import { NextRequest } from 'next/server';

type Ctx = { params: { id: string } };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const user = getSessionUserFromHeader(req);
    if (!user) return json({ error: 'Não autenticado' }, { status: 401 });

    const body = await req.json();
    const dto = UpdateUserSchema.parse(body);
    const updated = await userService.updateUser(user, params.id, dto);
    return json(updated);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  try {
    const user = getSessionUserFromHeader(req);
    if (!user) return json({ error: 'Não autenticado' }, { status: 401 });

    const res = await userService.deleteUser(user, params.id);
    return json(res, { status: 200 });
  } catch (err) {
    return handleRouteError(err);
  }
}
