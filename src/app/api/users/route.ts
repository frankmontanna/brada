import { getSessionUserFromHeader } from '@/lib/auth/sessionUser';
import { handleRouteError, json } from '@/lib/http';
import { CreateUserSchema } from '@/lib/validators/userSchemas';
import { userService } from '@/services/userService';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const user = getSessionUserFromHeader(req);
    if (!user) return json({ error: 'Não autenticado' }, { status: 401 });

    const list = await userService.listUsers(user);
    return json(list);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getSessionUserFromHeader(req);
    if (!user) return json({ error: 'Não autenticado' }, { status: 401 });

    const body = await req.json();
    const dto = CreateUserSchema.parse(body);
    const created = await userService.createUser(user, dto);
    return json(created, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
