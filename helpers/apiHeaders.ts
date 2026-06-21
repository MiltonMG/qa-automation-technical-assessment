const REQRES_API_KEY = process.env.REQRES_API_KEY ?? '';

const apiHeaders = (): Record<string, string> =>
  REQRES_API_KEY ? { 'x-api-key': REQRES_API_KEY } : {};

export { apiHeaders };