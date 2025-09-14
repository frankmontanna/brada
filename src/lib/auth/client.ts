'use client';

export function getSessionUserRaw(): string | null {
  try {
    return sessionStorage.getItem('user');
  } catch {
    return null;
  }
}

export async function logout(redirectPath = '/login') {
  try {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
  } catch {
    // mesmo se falhar o request, continuamos a limpar client-side
  } finally {
    try {
      sessionStorage.removeItem('user');
    } catch {}
    // se você salvar algo no localStorage também, limpe aqui
    // localStorage.removeItem('user');
    window.location.href = redirectPath;
  }
}

/**
 * Se não existir sessão no sessionStorage, forçamos logout para recomeçar o fluxo.
 * Use dentro de um useEffect logo ao montar a página.
 */
export function ensureSessionOrLogout(redirectPath = '/login') {
  const raw = getSessionUserRaw();
  if (!raw) {
    // sem sessão client-side => desloga para “desbugar”
    // não é async de propósito; o logout cuida do redirect
    void logout(redirectPath);
  }
}
