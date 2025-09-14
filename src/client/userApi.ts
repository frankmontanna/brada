type UserHeader = { id: string; username: string; role: 'ADMIN'|'USER'; name?: string | null };

function getUserHeader(): string | null {
  try {
    const raw = sessionStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserHeader;
    if (!parsed?.id || !parsed?.username || !parsed?.role) return null;
    return JSON.stringify(parsed);
  } catch {
    return null;
  }
}

async function api(input: RequestInfo, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  const user = getUserHeader();
  if (user) headers.set('x-user', user);
  return fetch(input, { ...init, headers });
}

export const UsersAPI = {
  list: async () => {
    const res = await api('/operador', { method: 'GET' });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  create: async (payload: {username: string; password: string; name?: string | null; role?: 'ADMIN'|'USER'; active?: boolean;}) => {
    const res = await api('/operador', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  update: async (id: string, payload: Partial<{name: string | null; password: string; role: 'ADMIN'|'USER'; active: boolean;}>) => {
    const res = await api(`/operador/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  remove: async (id: string) => {
    const res = await api(`/operador/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};
