import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';
import { defineConfig } from '@trigger.dev/sdk/v3';

const packageDir = process.cwd();

// Monorepo root .env, then package overrides (.env.local takes precedence over .env)
loadEnv({ path: resolve(packageDir, '../../.env') });
loadEnv({ path: resolve(packageDir, '.env') });
loadEnv({ path: resolve(packageDir, '.env.local'), override: true });

const projectId = process.env.TRIGGER_PROJECT_ID;
if (!projectId) {
  throw new Error(
    'TRIGGER_PROJECT_ID is required. Set it in the repo root .env or packages/trigger/.env.local (get the project ref from cloud.trigger.dev).',
  );
}

export default defineConfig({
  project: projectId,
  runtime: 'node',
  logLevel: 'log',
  maxDuration: 300,
  retries: { enabledInDev: true, default: { maxAttempts: 1 } },
  dirs: ['./jobs'],
});
