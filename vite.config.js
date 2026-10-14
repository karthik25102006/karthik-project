import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { createApiMiddleware } from './server/apiRouter.js';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from .env and .env.local
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      {
        name: 'life-translator-backend-api',
        configureServer(server) {
          server.middlewares.use(createApiMiddleware());
        },
      },
    ],
  };
});

