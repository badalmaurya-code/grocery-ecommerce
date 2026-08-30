// @ts-ignore - importing the pre-built bundle (see package.json "build" script)
import { createApp } from '../dist/server.cjs';

let appPromise: ReturnType<typeof createApp> | null = null;

export default async function handler(req: any, res: any) {
  if (!appPromise) {
    appPromise = createApp();
  }

  const app = await appPromise;

  return app(req, res);
}