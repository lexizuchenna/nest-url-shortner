import dotenv from 'dotenv';

dotenv.config({ path: ['.env.local', '.env'] });

export const env = {
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET || '',
  PUBLIC_KEY: process.env.PUBLIC_KEY || 'public_key',
} as const;
