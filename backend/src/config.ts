import dotenv from 'dotenv';
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  supabaseUrl: requireEnv('SUPABASE_URL'),
  supabaseServiceKey: requireEnv('SUPABASE_SERVICE_KEY'),
  supabaseAnonKey: requireEnv('SUPABASE_ANON_KEY'),
  jwtSecret: requireEnv('JWT_SECRET'),
  port: parseInt(process.env.PORT || '3001', 10),
};
