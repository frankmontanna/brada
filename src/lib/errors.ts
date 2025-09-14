export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const asHttpError = (err: unknown): HttpError => {
  if (err instanceof HttpError) return err;
  return new HttpError(500, 'Erro interno');
};
