import { getSessionUserFromHeader } from '@/lib/auth/sessionUser';
import { handleRouteError, json } from '@/lib/http';
import { UpdatePasswordSchema } from '@/lib/validators/userSchemas';
import { userService } from '@/services/userService';
import { NextRequest } from 'next/server';

type Ctx = { params: { id: string } };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const user = getSessionUserFromHeader(req);
    if (!user) return json({ error: 'Não autenticado' }, { status: 401 });

    const body = await req.json();
    const dto = UpdatePasswordSchema.parse(body);
    const res = await userService.updatePassword(user, params.id, dto);
    return json(res);
  } catch (err) {
    return handleRouteError(err);
  }
}
