export type SessionUser = {
  id: string;
  username: string;
  role: 'ADMIN' | 'USER';
  name?: string | null;
};

export function getSessionUserFromHeader(req: Request): SessionUser | null {
  const raw = (req.headers.get('x-session-user') || '').trim();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.id && parsed?.username && parsed?.role) {
      return parsed as SessionUser;
    }
    return null;
  } catch {
    return null;
  }
}

export function ensureAuthenticated(user: SessionUser | null) {
  if (!user) {
    throw new (class extends Error {})('Unauthenticated');
  }
}

export function ensureAdmin(user: SessionUser) {
  if (user.role !== 'ADMIN') {
    throw new (class extends Error {})('Forbidden');
  }
}
