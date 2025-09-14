type SessionUser = { id: string; username: string; role: 'ADMIN' | 'USER'; name?: string | null };

function sessionHeader(): HeadersInit {
  const raw = sessionStorage.getItem('user'); // já existe na sua app
  return raw ? { 'x-session-user': raw, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export async function listUsers() {
  const res = await fetch('/api/users', { headers: sessionHeader(), cache: 'no-store' });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<Array<{ id: string; username: string; name?: string | null; role: string; active: boolean }>>;
}

export async function createUser(input: { username: string; password: string; name?: string; role?: 'ADMIN' | 'USER'; active?: boolean }) {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: sessionHeader(),
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateUser(id: string, input: { name?: string; role?: 'ADMIN' | 'USER'; active?: boolean }) {
  const res = await fetch(`/api/users/${id}`, {
    method: 'PATCH',
    headers: sessionHeader(),
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updatePassword(id: string, password: string) {
  const res = await fetch(`/api/users/${id}/password`, {
    method: 'PATCH',
    headers: sessionHeader(),
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteUser(id: string) {
  const res = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
    headers: sessionHeader(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
