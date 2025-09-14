import { asHttpError, HttpError } from '@/lib/errors';
import { NextResponse } from 'next/server';

export const json = (data: unknown, init?: number | ResponseInit) =>
  NextResponse.json(
    data,
    typeof init === 'number' ? { status: init } : init
  );

export const handleRouteError = (err: unknown) => {
  const http = asHttpError(err);
  const status = http instanceof HttpError ? http.status : 500;
  const message = http instanceof HttpError ? http.message : 'Erro inesperado';
  return json({ error: message }, { status });
};
