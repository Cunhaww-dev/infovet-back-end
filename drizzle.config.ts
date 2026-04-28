import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { env } from '@/config/env';

export default defineConfig({
  schema: './src/db/schema/',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
