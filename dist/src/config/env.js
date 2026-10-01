import 'dotenv/config';
import { z } from 'zod';
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'), PORT: z.coerce.number().int().positive().default(5000), CLIENT_URL: z.string().default('http://localhost:5173'),
    DATABASE_URL: z.string().optional(), DATABASE_HOST: z.string().default('localhost'), DATABASE_PORT: z.coerce.number().int().positive().default(3306), DATABASE_USER: z.string().default('root'), DATABASE_PASSWORD: z.string().default(''), DATABASE_NAME: z.string().default('build_future_tourism'),
    JWT_ACCESS_SECRET: z.string().min(32), JWT_REFRESH_SECRET: z.string().min(32), JWT_ACCESS_EXPIRES_IN: z.string().default('15m'), JWT_REFRESH_EXPIRES_IN: z.string().default('7d'), COOKIE_NAME: z.string().default('bft_refresh_token'),
    CLOUDINARY_CLOUD_NAME: z.string().optional(), CLOUDINARY_API_KEY: z.string().optional(), CLOUDINARY_API_SECRET: z.string().optional(),
    SMTP_HOST: z.string().optional(), SMTP_PORT: z.coerce.number().int().positive().default(587), SMTP_USER: z.string().optional(), SMTP_PASSWORD: z.string().optional(), EMAIL_FROM: z.string().email().optional(),
    SEED_ADMIN_EMAIL: z.string().email().default('admin@buildfuturetourism.rw'), SEED_ADMIN_PASSWORD: z.string().min(8).default('ChangeMe123!')
});
export const env = envSchema.parse(process.env);
//# sourceMappingURL=env.js.map